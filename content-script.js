(()=>{
  const classA = 'fabkit-Stack-root';
  const classB = 'nTa5u2sc';
  const textMatch = 'Saved in My Library';

  let loopRemovalInterval = null;
  let cartClickInterval = null;
  let removedCount = 0;
  let claimedCount = 0;

  function hasClasses(el){
    if(!el || !el.className) return false;
    const parts = String(el.className).split(/\s+/);
    return parts.includes(classA) && parts.includes(classB);
  }

  function removeMatches(root=document){
    let removed = false;
    try{
      // Find all elements containing the target text
      const allDivs = root.querySelectorAll('div');
      allDivs.forEach(el=>{
        const text = String(el.textContent || '');
        if(text.indexOf(textMatch) !== -1){
          // Found text, now find the parent with target classes
          let parent = el;
          while(parent && parent !== document.body){
            if(parent.tagName === 'DIV' && hasClasses(parent)){
              parent.remove();
              removed = true;
              removedCount++;
              // Send count update to popup
              try{
                chrome.runtime.sendMessage({type:'update-counts', removed: removedCount, claimed: claimedCount});
              }catch(e){/* ignore */}
              return;
            }
            parent = parent.parentElement;
          }
        }
      });
    }catch(e){/* ignore */}
    return removed;
  }

  function hasMatches(root=document){
    try{
      const allDivs = root.querySelectorAll('div');
      for(let i=0; i<allDivs.length; i++){
        const el = allDivs[i];
        const text = String(el.textContent || '');
        if(text.indexOf(textMatch) !== -1){
          let parent = el;
          while(parent && parent !== document.body){
            if(parent.tagName === 'DIV' && hasClasses(parent)){
              return true;
            }
            parent = parent.parentElement;
          }
        }
      }
    }catch(e){/* ignore */}
    return false;
  }

  function startLoopRemoval(){
    if(loopRemovalInterval) clearInterval(loopRemovalInterval);
    removeMatches(document);
    
    const step = Math.max(150, Math.floor(window.innerHeight * 0.75));
    loopRemovalInterval = setInterval(()=>{
      // Scroll down to trigger lazy loading
      window.scrollBy({top: step, left:0, behavior:'smooth'});
      
      // Wait a bit for lazy load, then remove
      setTimeout(()=>{
        removeMatches(document);
        
        // Check if we've reached the bottom and no more matches
        const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 100;
        if(atBottom && !hasMatches(document)){
          clearInterval(loopRemovalInterval);
          loopRemovalInterval = null;
          // Notify popup that loop is done
          try{
            chrome.runtime.sendMessage({type:'loop-removal-done'});
          }catch(e){/* ignore */}
        }
      }, 300);
    }, 1000);
  }

  // respond to runtime messages from popup buttons
  try{
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
      if(msg && msg.type === 'remove-now'){
        try{ removeMatches(document); }catch(e){}
        if(sendResponse) sendResponse({ok:true});
      }
      if(msg && msg.type === 'start-loop-removal'){
        try{ startLoopRemoval(); }catch(e){}
        if(sendResponse) sendResponse({ok:true});
      }
      if(msg && msg.type === 'stop-loop-removal'){
        try{
          if(loopRemovalInterval){
            clearInterval(loopRemovalInterval);
            loopRemovalInterval = null;
          }
        }catch(e){/* ignore */}
        if(sendResponse) sendResponse({ok:true});
      }
      if(msg && msg.type === 'start-cart-clicking'){
        try{
          if(cartClickInterval) clearInterval(cartClickInterval);
          cartClickInterval = setInterval(()=>{
            // Find all listing cards on the page
            const listings = document.querySelectorAll('[class*="fabkit-Stack-root"]');
            listings.forEach(listing => {
              // Trigger hover events on the listing card
              listing.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true, cancelable: true, view: window}));
              listing.dispatchEvent(new MouseEvent('mouseover', {bubbles: true, cancelable: true, view: window}));
              
              // Wait a bit for the button to appear, then click it
              setTimeout(() => {
                const claimBtn = listing.querySelector('[class*="edison-square-grid-plus"]');
                if(claimBtn && !claimBtn.disabled) {
                  claimBtn.click();
                  claimedCount++;
                  // Send count update to popup
                  try{
                    chrome.runtime.sendMessage({type:'update-counts', removed: removedCount, claimed: claimedCount});
                  }catch(e){/* ignore */}
                }
              }, 100);
            });
          }, 1500);
        }catch(e){/* ignore */}
        if(sendResponse) sendResponse({ok:true});
      }
      if(msg && msg.type === 'stop-cart-clicking'){
        try{
          if(cartClickInterval){
            clearInterval(cartClickInterval);
            cartClickInterval = null;
          }
        }catch(e){/* ignore */}
        if(sendResponse) sendResponse({ok:true});
      }
      if(msg && msg.type === 'get-counts'){
        if(sendResponse) sendResponse({removed: removedCount, claimed: claimedCount});
      }
      if(msg && msg.type === 'reset-counts'){
        removedCount = 0;
        claimedCount = 0;
        if(sendResponse) sendResponse({ok:true});
      }
    });
  }catch(e){/* ignore */}

})();
