# FabOwnedFilter

Chrome/Edge extension for fab.com that helps manage your library by removing "Saved in My Library" items and auto-claiming listings.

## ✨ Features

### 🗑️ Remove Saved Items
- **Remove Now**: Automatically scrolls down the page and removes all items marked as "Saved in My Library"
- **Stop Removing**: Stops the removal process at any time
- Tracks number of items removed

### ⭐ Auto Claim Listings
- **Auto Claim**: Automatically hovers over listings and claims them to your library
- **Stop Auto Claiming**: Stops the auto-claiming process
- Works with hover-only "Add to Library" buttons
- Tracks number of items claimed

### 📊 Live Statistics
- Real-time counters for removed and claimed items
- Reset counts button to start fresh

## 🚀 Installation

1. Download or clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" and select the FabOwnedFilter folder
5. The extension will appear in your toolbar

## 📖 How to Use

1. Visit [fab.com](https://www.fab.com/) or [www.fab.com](https://www.fab.com/)
2. Click the FabOwnedFilter extension icon in your toolbar
3. Use the buttons:
   - **Remove Now** - Start removing "Saved in My Library" items
   - **Stop Removing** - Stop the removal process
   - **Auto Claim** - Start auto-claiming listings to your library
   - **Stop Auto Claiming** - Stop auto-claiming
   - **Reset Counts** - Reset the removed/claimed counters to zero

## 🛠️ Technical Details

- **Permissions**: Only runs on fab.com domains
- **Auto-scroll**: Triggers lazy-loading to find all items
- **Hover simulation**: Simulates mouse hover to reveal hidden claim buttons
- **Non-intrusive**: Only removes/claims when you activate it

## ⭐ Support

If you find this extension helpful, please star this repository on GitHub!

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/FabOwnedFilter?style=social)](https://github.com/yourusername/FabOwnedFilter)

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Issues and pull requests are welcome!
