# 🔍 FactGuard: Multi-Agent Fact Checker

FactGuard is an AI-powered Chrome extension designed to combat misinformation by providing real-time fact-checking of web content. It analyzes the text of any webpage, identifies key claims, and verifies them against reliable sources using a multi-agent AI architecture.

## 🚀 Features

-   **Intelligent Content Extraction:** Automatically strips away navigation menus, footers, and ads to focus on the core article content.
-   **Real-time Claim Verification:** Streams claim-by-claim analysis directly to your side panel using Server-Sent Events (SSE).
-   **Visual Verdicts:** Categorizes claims as **SUPPORTED**, **CONTRADICTED**, or **UNVERIFIABLE** with clear color coding.
-   **Trust Score:** Calculates an overall trust percentage for the entire page to help you decide if it's safe to share.
-   **Direct Citations:** Provides links to the sources used for verification, allowing you to dive deeper into the facts.
-   **Seamless UI:** Integrated into the Chrome Side Panel for an unobtrusive research experience.

## 🛠️ Tech Stack

-   **Frontend:** Chrome Extension Manifest V3, JavaScript, HTML5, CSS3 (Vanilla).
-   **Backend:** Node.js / Python (Backend repository required to run at `http://localhost:8080`).
-   **AI Engine:** Powered by Google's Gemini API for multi-agent reasoning and fact-checking.
-   **Communication:** Server-Sent Events (SSE) for low-latency, real-time updates.

## 📥 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/Google-Hackathon---FactGuard.git
    ```
2.  **Load the extension in Chrome:**
    -   Open Chrome and navigate to `chrome://extensions/`.
    -   Enable **Developer mode** (toggle in the top right corner).
    -   Click **Load unpacked**.
    -   Select the `extension` folder within this repository.
3.  **Start the Backend:**
    -   Ensure your backend server is running at `http://localhost:8080`.
    -   *(Note: The backend code is not included in this repository. Ensure you have the corresponding FactGuard-Backend service running.)*

## 📖 How to Use

1.  Navigate to any news article or blog post you want to verify.
2.  Click the **FactGuard** icon in your extension toolbar.
3.  The **FactGuard Side Panel** will open.
4.  Click **"Check This Page"**.
5.  Watch as claims are extracted and verified in real-time.
6.  Review the **Trust Report** and **Overall Trust Score** before sharing the content.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created for the Google Hackathon.*
