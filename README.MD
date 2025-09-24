# 📸 WikiSniffer

> *Because manually screenshotting Wikipedia articles is so 2010*

WikiSniffer is your friendly neighborhood Wikipedia stalker – but in a totally legal and wholesome way! 🕵️‍♂️ It automates the mind-numbing task of searching Wikipedia, scrolling through articles, and taking pristine screenshots. Perfect for research, presentations, or when you want to impress your friends with your "extensive Wikipedia knowledge" (we won't tell).

## 🤔 What Does This Thing Do?

Ever found yourself:
- 📚 Researching 47 different topics for a project
- 🎯 Needing screenshots of Wikipedia articles for presentations  
- 😴 Falling asleep while manually screenshotting pages
- 🤖 Wishing you had a robot assistant (but settling for a JavaScript script)

WikiSniffer automates all of that! Feed it a list of topics, grab a coffee ☕, and come back to a folder full of beautiful Wikipedia screenshots.



## 🛠️ Installation & Setup

### Prerequisites
Make sure you have Node.js installed (version 22 or higher). If you don't, grab it from [nodejs.org](https://nodejs.org/).

### Step 1: Clone the repo

```bash
git clone https://github.com/smaranjitghose/wikisniffer
```

### Step 2: Navigate inside the repository

```bash
cd wikisniffer
```

### Step 3: Install Dependencies
```bash
npm install
npx playwright install chromium
```

*Note: The second command downloads a Chromium browser (~100MB). Go make that coffee now!*

### Step 4: Prepare Your Terms File
Create a `topics.txt` file with one search term per line:

```
artificial intelligence
quantum computing
climate change
space exploration
machine learning
```

## 🚀 Usage

```bash
node run dev
```

## 📁 Output Structure

After running, you'll find your screenshots in the `snapshots/` directory:

```
snapshots/
├── artificial_intelligence_2024-09-24.png
├── quantum_computing_2024-09-24.png
├── climate_change_2024-09-24.png
└── space_exploration_2024-09-24.png
```

## 🎭 What You'll See

When you run WikiSniffer, expect a delightful show:

```
🚀 Launching browser...
📁 Created snapshots directory: /your/project/snapshots
📖 Reading terms from: terms.txt
Found 5 terms to process

--- Processing 1/5: artificial intelligence ---
🔍 Searching for: "artificial intelligence"
✅ Loaded page: https://en.wikipedia.org/wiki/Artificial_intelligence
📜 Scrolling down...
📸 Screenshot saved: artificial_intelligence_2024-09-24.png
⏳ Waiting before next search...

[... more magical automation ...]

📊 SUMMARY:
==================================================
✅ Successful: 4/5
❌ Failed: 1/5

📸 Screenshots saved:
  • artificial_intelligence_2024-09-24.png
  • quantum_computing_2024-09-24.png
  • climate_change_2024-09-24.png
  • space_exploration_2024-09-24.png

✨ All terms processed!
```

## ⚙️ Configuration Options

Want to tweak things? Here are some options you can modify in the code:

- **Headless mode**: Change `headless: false` to `headless: true` to run without showing the browser
- **Slow motion**: Adjust `slowMo: 300` to make it faster (lower) or slower (higher)
- **Scroll amount**: Modify the `mouse.wheel()` values in `searchAndCapture()` method
- **Screenshot format**: Currently saves as PNG, but you can switch to JPEG if needed

## 🐛 Troubleshooting

### "Command not found" errors
Make sure you have Node.js installed and you're in the right directory.

### Screenshots are weird/blank
This usually means the page didn't load properly. Check your internet connection and try again.

### Some searches fail
Wikipedia is vast and sometimes search terms are ambiguous. The script will continue with other terms and show you exactly what failed in the summary.

### Browser won't close
Press `Ctrl+C` (or `Cmd+C` on Mac) to force quit the script.

## 🤝 Contributing

Found a bug? Want to add a feature? PRs welcome! This project follows the "make it work, then make it better" philosophy.

Some ideas for improvements:
- 🌍 Support for other Wikipedia languages
- 📱 Mobile viewport screenshots
- 🎨 Custom scroll patterns
- 📊 Export results to CSV/JSON
- 🚀 Parallel processing for speed demons

## 📜 License

MIT License - basically, do whatever you want with this code. Build something cool!


