document.addEventListener('DOMContentLoaded', ()=>{
  const removeNowBtn = document.getElementById('removeNow');
  const stopRemovingBtn = document.getElementById('stopRemoving');
  const cartClickBtn = document.getElementById('cartClick');
  const stopClaimingBtn = document.getElementById('stopClaiming');
  const resetCountsBtn = document.getElementById('resetCounts');
  const removedCountEl = document.getElementById('removedCount');
  const claimedCountEl = document.getElementById('claimedCount');

  // Load initial counts
  chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
    const t = tabs && tabs[0];
    if(t && t.id){
      chrome.tabs.sendMessage(t.id, {type:'get-counts'}, (response)=>{
        if(response){
          removedCountEl.textContent = response.removed || 0;
          claimedCountEl.textContent = response.claimed || 0;
        }
      });
    }
  });

  // Remove Now button - triggers immediate removal and loops every 2 seconds
  removeNowBtn.addEventListener('click', ()=>{
    chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
      const t = tabs && tabs[0];
      if(t && t.id){
        chrome.tabs.sendMessage(t.id, {type:'start-loop-removal'}, ()=>{});
        removeNowBtn.textContent = 'Removing...';
        stopRemovingBtn.disabled = false;
      }
    });
  });

  // Stop Removing button - stops the removal loop
  stopRemovingBtn.addEventListener('click', ()=>{
    chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
      const t = tabs && tabs[0];
      if(t && t.id){
        chrome.tabs.sendMessage(t.id, {type:'stop-loop-removal'}, ()=>{});
        removeNowBtn.textContent = 'Remove Now';
        stopRemovingBtn.disabled = true;
      }
    });
  });

  // Cart Click button - starts auto-clicking cart buttons
  cartClickBtn.addEventListener('click', ()=>{
    chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
      const t = tabs && tabs[0];
      if(t && t.id){
        chrome.tabs.sendMessage(t.id, {type:'start-cart-clicking'}, ()=>{});
        cartClickBtn.textContent = 'Claiming...';
        stopClaimingBtn.disabled = false;
      }
    });
  });

  // Stop Auto Claiming button - stops auto-clicking cart buttons
  stopClaimingBtn.addEventListener('click', ()=>{
    chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
      const t = tabs && tabs[0];
      if(t && t.id){
        chrome.tabs.sendMessage(t.id, {type:'stop-cart-clicking'}, ()=>{});
        cartClickBtn.textContent = 'Auto Claim';
        stopClaimingBtn.disabled = true;
      }
    });
  });

  // Listen for loop completion message
  chrome.runtime.onMessage.addListener((msg)=>{
    if(msg && msg.type === 'loop-removal-done'){
      removeNowBtn.textContent = 'Remove Now';
      stopRemovingBtn.disabled = true;
    }
    if(msg && msg.type === 'update-counts'){
      removedCountEl.textContent = msg.removed || 0;
      claimedCountEl.textContent = msg.claimed || 0;
    }
  });

  // Reset counts button
  resetCountsBtn.addEventListener('click', ()=>{
    chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
      const t = tabs && tabs[0];
      if(t && t.id){
        chrome.tabs.sendMessage(t.id, {type:'reset-counts'}, ()=>{});
        removedCountEl.textContent = '0';
        claimedCountEl.textContent = '0';
      }
    });
  });
});
