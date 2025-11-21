<div align="center">

# 👁️ Pupillix

### AI-Powered Hands-Free Computer Control

*Empowering accessibility through facial recognition and deep learning*

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-0.10-00ACC1?style=for-the-badge&logo=google&logoColor=white)](https://mediapipe.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[📥 Download](https://drive.google.com/file/d/1mCLrdcmrXXq5FoT2x-EqkcHO19FOUVwQ/view?usp=sharing) • [🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation)

</div>

---

## 🌟 Overview

**Pupillix** is a comprehensive accessibility platform that enables individuals with mobility impairments to control computers using only facial movements and eye blinks. Built with cutting-edge AI and computer vision, Pupillix combines a desktop application with a full-stack web platform for user management and download analytics.

### Key Highlights

- 🧠 **Deep Learning**: 478 facial landmarks tracked in real-time using TensorFlow Lite
- 🖱️ **Natural Control**: Head movements → cursor control, eye blinks → mouse clicks  
- 🔐 **Secure Platform**: JWT authentication with bcrypt password hashing
- 📊 **Analytics Dashboard**: Track downloads, user statistics, and engagement metrics
- 📦 **Ready to Deploy**: Standalone 231MB Windows executable

---

## ✨ Features

### Desktop Application
- ✅ **Real-time Facial Tracking** - 478 landmarks at 60 FPS using MediaPipe FaceMesh
- ✅ **Precision Mouse Control** - Head movements translated to smooth cursor motion
- ✅ **Blink-to-Click** - Left eye = left click, Right eye = right click
- ✅ **Guided Calibration** - Personalized setup for optimal performance
- ✅ **Live Preview** - Real-time video feed with landmark visualization
- ✅ **Cross-platform** - Windows, macOS, and Linux support

### Web Platform
- 🌐 **Modern Landing Page** - Beautiful gradient design with animations
- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 📊 **Download Tracking** - IP address, user agent, timestamp analytics
- 👥 **User Management** - Profile dashboard with download history
- 📈 **Admin Console** - View all users and download statistics

---

## 🏗️ Tech Stack

### Desktop Application
| Technology | Purpose |
|------------|---------|
| **Python 3.11** | Core application |
| **MediaPipe** | Facial landmark detection (TensorFlow Lite) |
| **OpenCV** | Computer vision & video processing |
| **PyAutoGUI** | Mouse control automation |
| **Tkinter** | GUI framework |
| **PyInstaller** | Executable packaging |

### Backend API
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Token-based authentication |
| **bcrypt** | Password hashing |
| **Helmet** | Security middleware |

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure & semantics |
| **CSS3** | Styling & animations |
| **JavaScript (ES6+)** | Client-side logic |
| **Fetch API** | HTTP requests |

---

## 🚀 Quick Start

### Desktop Application

```bash
# Clone the repository
git clone https://github.com/yourusername/pupillix.git
cd pupillix

# Create virtual environment
conda create -n pupillix python=3.11 -y
conda activate pupillix

# Install dependencies
pip install -r requirements.txt

# Run the application
cd python
python main.py
```

### Backend Server

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server
npm run dev
```

### Frontend Website

```bash
# Navigate to web folder
cd web

# Start HTTP server (Python)
python -m http.server 8080

# OR use npm
npm start
```

**Access the website**: http://localhost:8080

---

## 📚 Documentation

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create new user account |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/verify` | Verify JWT token |
| `GET` | `/api/user/profile` | Get user profile |
| `GET` | `/api/user/download-history` | Get download history |
| `POST` | `/api/download/track` | Track download event |
| `GET` | `/api/download/stats` | Get download statistics |

---

## 📁 Project Structure

```
pupillix/
├── python/                    # Desktop Application
│   ├── main.py               # Main application logic
│   └── icon.ico              # App icon
│
├── backend/                   # Node.js API Server
│   ├── server.js             # Express server
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth middleware
│   └── package.json          # Dependencies
│
├── web/                       # Frontend Website
│   ├── index.html            # Landing page
│   ├── style.css             # Styles
│   └── script.js             # Client logic
│
├── .gitignore                # Git ignore rules
├── LICENSE                   # MIT License
├── README.md                 # This file
└── requirements.txt          # Python dependencies
```

**Package size**: ~231 MB

---

## 🔧 Building Executable

Create a standalone Windows executable:

```bash
cd python

# Install PyInstaller
pip install pyinstaller

# Build executable
pyinstaller --onedir --windowed --icon=icon.ico --name=Pupillix \
  --add-data "icon.ico;." \
  --collect-all mediapipe \
  --collect-all cv2 \
  --copy-metadata mediapipe \
  main.py
```

Executable location: `python/dist/Pupillix/Pupillix.exe`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Pupillix** - Bridging the digital divide through innovation 🚀

Made with ❤️ for accessibility

</div>


