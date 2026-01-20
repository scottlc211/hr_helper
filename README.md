<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HR Events Pro 🎉

A modern HR event management tool featuring Lucky Draw and Smart Grouping capabilities, powered by Google Gemini AI.

## ✨ Features

- 👥 **Participant Management**: Add, edit, and manage participant lists
- 🏆 **Lucky Draw**: Conduct random draws with beautiful animations
- 📊 **Auto Grouping**: Intelligently group participants with AI-generated team names
- 💾 **Local Storage**: Automatically saves your data locally
- 🎨 **Modern UI**: Clean, responsive design with glassmorphism effects

## 🚀 Live Demo

View the deployed app: [https://scottlc211.github.io/hr_helper/](https://scottlc211.github.io/hr_helper/)

## 🛠️ Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/scottlc211/hr_helper.git
   cd hr_helper
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **(Optional) Configure Gemini API**:
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a `.env` file in the project root:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Note: The app works without an API key, but will use default team names instead of AI-generated ones

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🚢 Deploy to GitHub Pages

This project is configured with GitHub Actions for automatic deployment.

### Setup Steps:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to **Pages** section
   - Under **Source**, select **GitHub Actions**

2. **(Optional) Add Gemini API Key**:
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

3. **Push to main branch**:

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Wait for deployment**:
   - GitHub Actions will automatically build and deploy your app
   - Check the **Actions** tab to monitor the deployment progress
   - Once complete, your app will be live at: `https://[your-username].github.io/hr_helper/`

## 🔧 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Deployment**: GitHub Pages + GitHub Actions

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ for modern workplaces
