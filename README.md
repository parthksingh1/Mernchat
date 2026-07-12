# 💬 MERN Real-Time Chat & Video App

A premium, full-stack real-time messaging and video/audio calling application built using the MERN stack (MongoDB, Express, React, Node.js). It integrates WebSockets via **Socket.io** for real-time connection status and instant messages, and WebRTC via **Simple-Peer** and **PeerJS** for peer-to-peer audio/video calls. The UI is designed using **TailwindCSS** and **DaisyUI** to provide a rich theme-swapping, responsive user experience.

---

## 🚀 Key Features

*   **Real-time Instant Messaging**: Send and receive messages instantly without page refresh, powered by Socket.io.
*   **Peer-to-Peer Voice & Video Calls**: Fully integrated audio/video calling using WebRTC protocols.
*   **Secure JWT Authentication**: Authentication implemented with cookies (HttpOnly, Secure, SameSite configuration) for JWT to mitigate XSS and CSRF risks.
*   **Media Sharing**: Share images directly in chats, handled by Cloudinary cloud storage integration.
*   **Live User Status**: See who is currently online/offline in real-time.
*   **Customizable Theme System**: Toggle between multiple pre-configured modern UI themes (dark, coffee, retro, light, forest, etc.) powered by DaisyUI.
*   **Real-Time Typing Indicators**: Visual bouncing bubble animations indicating when a user is actively typing.
*   **Message Read Receipts**: Tracks and renders delivery states (single check `✓` for sent/delivered, double blue checks `✓✓` for read).
*   **Fully Responsive UI**: Mobile-first design that scales beautifully from smartphones to large desktop screens.

---

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**: Fast build tool and modern component-based UI library.
- **Zustand**: Clean, boilerplate-free state management.
- **TailwindCSS & DaisyUI**: Utility-first CSS framework coupled with modular components and themes.
- **Socket.io-client**: Real-time server communication wrapper.
- **Simple-peer / PeerJS**: Seamless WebRTC handshakes for audio/video calls.
- **React Router DOM**: Frontend routing and page transitions.

### Backend
- **Node.js & Express**: Extensible server runtime and API framework.
- **MongoDB & Mongoose**: Flexible NoSQL document database and schema definition.
- **Socket.io**: WebSockets for event-driven bi-directional communication.
- **Cloudinary SDK**: Cloud storage for uploaded chat attachments.
- **JSON Web Token (JWT) & Cookie Parser**: Session security and cookie management.

---

## ⚙️ Environment Configuration

Before launching the application, you need to configure the environment variables.

### 1. Server Environment Configuration
Create a `.env` file in the `server` directory (`server/.env`) and add the following keys:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
NODE_ENV=development

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Client Environment Configuration (Optional)
If deploying or using custom endpoints, you can optionally configure environment variables in `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```
*(By default, the client is pre-configured to fall back to `http://localhost:5001/api` in development).*

---

## 🏁 Getting Started

Follow these step-by-step instructions to get your local development environment up and running.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)
- A [Cloudinary](https://cloudinary.com/) account for image storage and uploads.

### Installation

1.  **Clone / Download the project repository**.
2.  **Install all dependencies** (Root, Client, and Server packages) using the helper script from the root directory:
    ```bash
    npm run install:all
    ```
    This script automatically runs `npm install` in the root, client, and server directories.

---

## 🚦 Running the Application

You can run both the frontend and backend concurrently or run them separately.

### Option A: Run Concurrently (Recommended)
From the root directory of the project, execute:
```bash
npm run dev
```
This command uses `concurrently` to start:
- Backend server on `http://localhost:5001`
- Frontend development server (Vite) on `http://localhost:5173`

### Option B: Run Services Separately

#### 1. Start the Backend Server:
```bash
# Navigate to server directory and run dev
cd server
npm run dev
```
The server will boot and connect to MongoDB. It prints `server is running on PORT:5001` upon successful launch.

#### 2. Start the Frontend Client:
```bash
# Open a new terminal, navigate to client directory and run dev
cd client
npm run dev
```
Open `http://localhost:5173` in your browser to view and interact with the application.

---

## 📐 Design Decisions & Assumptions

### Design Decisions
*   **React (Web) vs. React Native**: React (Web) was selected over React Native to ensure instant accessibility, easier deployment and demonstration on local/cloud web targets, and straightforward testing within a browser environment.
*   **State Management (Zustand)**: Opted for Zustand due to its lightweight boilerplate and simple hooks integration, which cleanly handles active sockets, messages list synchronizations, and audio/video WebRTC statuses.
*   **Styling System**: Styled with TailwindCSS and DaisyUI components, offering a clean layout that adapts beautifully to both mobile and desktop screens while supporting an active dynamic theme selector.

### Assumptions Made
*   **Media Attachments (Cloudinary)**: Assumed image transfer was required. Image data is routed directly via Cloudinary Cloud API to prevent server disk bloat and ensure fast delivery using global CDNs.
*   **Cookie Security (JWT)**: Assumed maximum vulnerability mitigation was required. JSON Web Tokens are saved using secure, HTTP-only cookies to eliminate cookie readability from client-side scripts, protecting users against cross-site scripting (XSS) token theft.
*   **Typing State In-Memory**: Assumed typing states are temporary and should not persist. Thus, typing flags are managed strictly in-memory over Socket.io and cleaned up on user navigation or connection drops.

---

## 👤 Author & Maintainer

- **Developer**: Parth Kumar Singh
- **Release Date**: July 12, 2026

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).
