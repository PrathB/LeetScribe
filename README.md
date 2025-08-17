# LeetScribe

A Chrome extension that automatically annotates your LeetCode solutions with algorithm explanations, time complexity, and space complexity using AI/LLM integration.

![LeetScribe Logo](icons/icon128.png)

## Overview

LeetScribe helps competitive programmers and interview candidates better understand and document their coding solutions. When you solve a LeetCode problem, LeetScribe can instantly add comprehensive comments explaining:

- **Algorithm approach** - Step-by-step breakdown of your solution
- **Time complexity** - Big O analysis with reasoning
- **Space complexity** - Memory usage analysis with reasoning
- **Inline comments** - Key steps explained throughout the code

Perfect for reviewing your submissions later or sharing well-documented solutions with others.

## Features

- **AI-Powered Analysis** - Supports multiple LLM providers (OpenAI, Groq, etc.)
- **Seamless Integration** - Clean button added to LeetCode's interface
- **Smart Annotation** - Only annotates correct solutions; flags incorrect ones
- **Dark/Light Mode** - Matches your system preferences
- **Real-time Processing** - Instant analysis and code replacement
- **Secure Storage** - API credentials stored in Chrome's sync storage
- **SPA Compatible** - Works with LeetCode's single-page app navigation

## Installation

### From Source (Development)

1. **Clone the repository**

   ```bash
   git clone https://github.com/PrathB/LeetScribe
   cd LeetScribe
   ```

2. **Load the extension in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `LeetScribe` folder

3. **Configure your API**
   - Click the LeetScribe icon in your Chrome toolbar
   - Click "Open Settings"
   - Enter your LLM API details (see [Configuration](#-configuration))

### From Chrome Web Store

_Coming soon - extension will be published to the Chrome Web Store_

## ⚙️ Configuration

### Supported LLM Providers

#### OpenAI

- **API URL**: `https://api.openai.com/v1/chat/completions`
- **Model**: Choose your model from [OpenAI Available Models](https://platform.openai.com/docs/models)
- **API Key**: Get from [OpenAI Dashboard](https://platform.openai.com/api-keys)

#### Groq

- **API URL**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: Choose your model from [Groq Available Models](https://console.groq.com/docs/models)
- **API Key**: Get from [Groq Console](https://console.groq.com/keys)

#### Other OpenAI-Compatible APIs

LeetScribe works with any OpenAI-compatible API endpoint.

### Setup Steps

1. **Open Settings**

   - Click the LeetScribe extension icon
   - Click "Open Settings" button

2. **Enter API Details**

   - **API URL**: Your LLM provider's chat completions endpoint
   - **Model Name**: The specific model you want to use
   - **API Key**: Your authentication key

3. **Save Configuration**
   - Click "Save Settings"
   - Settings are automatically synced across your Chrome devices

## Usage

1. **Navigate to any LeetCode problem**

   - Go to `https://leetcode.com/problems/[problem-name]/`
   - Write your solution in the code editor

2. **Click the Annotate button**

   - Look for the "✏️ Annotate" button in the top toolbar
   - Click it to analyze your solution

3. **Review the annotations**

   - **Correct solutions**: Get detailed algorithm explanation, complexities, and inline comments
   - **Incorrect solutions**: See a simple "❌ The provided solution is incorrect" comment

4. **Learn and iterate**
   - Use the annotations to understand your approach better
   - Review complexity analysis to optimize your solutions
   - Share well-documented code with others

## Technical Details

### Architecture

- **Manifest V3** - Uses the latest Chrome extension API
- **Content Script** - Injects UI elements into LeetCode pages
- **Background Service Worker** - Handles API communication and code processing
- **Options Page** - Provides settings management interface
- **Popup** - Shows quick configuration status

### File Structure

```
LeetScribe/
├── manifest.json          # Extension configuration
├── background.js          # Service worker with core logic
├── content.js             # Content script for UI injection
├── options.html/js/css    # Settings page
├── popup.html/js/css      # Extension popup
├── styles.css             # Content script styles
└── icons/                 # Extension icons
```

### Key Features

- **Monaco Editor Integration** - Detects and interacts with LeetCode's code editor
- **Problem Title Extraction** - Automatically identifies the current problem
- **Smart Code Replacement** - Preserves formatting while adding annotations
- **Error Handling** - Comprehensive error handling and user feedback
- **Responsive Design** - Works across different screen sizes

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Setup

1. Clone the repo and load it as an unpacked extension
2. Make changes to the source files
3. Click the refresh button on `chrome://extensions/` to reload
4. Test on LeetCode problems

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/PrathB/LeetScribe/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/PrathB/LeetScribe/discussions)
- **Questions**: Create an issue with the "question" label

## Roadmap

- [ ] Chrome Web Store publication
- [ ] Local caching of annotations
- [ ] Batch processing multiple solutions
- [ ] Export annotations to various formats
- [ ] Custom annotation prompts
- [ ] Integration with other coding platforms like GeeksforGeeks Practice

## Acknowledgments

- LeetCode for providing an excellent platform for coding practice
- OpenAI and Groq for making powerful LLMs accessible
- The Chrome Extensions team for comprehensive documentation
- The competitive programming community for inspiration

---

**Made with ❤️ for the coding community**

_If LeetScribe helps you in your coding journey, consider giving it a ⭐ on GitHub!_
