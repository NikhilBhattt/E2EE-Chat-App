# 🔐 E2EE Chat App

A secure, end-to-end encrypted real-time messaging application built with React and Node.js. Messages are encrypted on the client side and can only be decrypted by the intended recipient.

## ✨ Features

- **End-to-End Encryption (E2EE)**: All messages are encrypted using client-side cryptography
- **Real-Time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: Secure JWT-based authentication with token management
- **User Search**: Find and initiate conversations with other users
- **Typing Indicator**: Animated typing status for live chat feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multi-Tab Support**: Secure token isolation across browser tabs
- **Message History**: Persistent message storage with decryption support

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **Socket.IO Client** - Real-time communication
- **CSS3** - Advanced styling with gradients and animations
- **Web Crypto API** - Client-side encryption/decryption

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Token-based authentication
- **Bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn** (v7 or higher)
- **MongoDB** (local or cloud instance via MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "E2EE Chat App"
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with the following variables
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default port)

## 📁 Project Structure

```
E2EE Chat App/
├── client/                          # React frontend
│   ├── src/
│   │   ├── Assets/                 # Static assets
│   │   ├── Components/             # Reusable components
│   │   │   ├── SearchUser.jsx      # User search component
│   │   │   └── SecurityPanel.jsx   # Security info panel
│   │   ├── Pages/                  # Page components
│   │   │   ├── Chat/               # Main chat interface
│   │   │   ├── Login/              # Login page
│   │   │   └── Register/           # Registration page
│   │   ├── crypto/                 # Encryption utilities
│   │   │   ├── encryptMessage.js   # Message encryption
│   │   │   ├── decryptMessage.js   # Message decryption
│   │   │   ├── generateKeys.js     # Key pair generation
│   │   │   ├── deriveSharedKey.js  # Shared key derivation
│   │   │   └── keyStorage.js       # Key management
│   │   ├── Utils/                  # Utility functions
│   │   │   ├── auth.js             # Authentication logic
│   │   │   ├── AuthWrapper.jsx     # Route protection
│   │   │   └── timeSince.js        # Time formatting
│   │   ├── App.jsx                 # Root component
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── server/                          # Node.js backend
    ├── src/
    │   ├── app.ts                  # Express app configuration
    │   ├── index.ts                # Server entry point
    │   ├── socketio.ts             # Socket.IO configuration
    │   ├── config/
    │   │   └── config.ts           # Environment configuration
    │   ├── controllers/            # Request handlers
    │   │   ├── user.controller.ts
    │   │   ├── chat.controller.ts
    │   │   └── message.controller.ts
    │   ├── models/                 # Database schemas
    │   │   ├── user.model.ts
    │   │   ├── chat.model.ts
    │   │   ├── message.model.ts
    │   │   └── blacklisttoken.model.ts
    │   ├── routes/                 # API endpoints
    │   │   ├── user.routes.ts
    │   │   ├── chat.routes.ts
    │   │   └── message.routes.ts
    │   ├── middleware/             # Custom middleware
    │   │   └── auth.middleware.ts
    │   ├── db/
    │   │   └── connection.ts       # Database connection
    │   └── utils/
    │       └── asyncHandler.ts     # Error handling wrapper
    ├── package.json
    ├── tsconfig.json
    └── nodemon.json
```

## 🔑 Key Features & Implementation

### Authentication Flow
1. User registers with username and password
2. Crypto keys (RSA key pair) are generated on client-side
3. Private key stored securely in browser storage
4. JWT token issued by backend and stored with dual strategy:
   - `localStorage`: Persistent per-user tokens
   - `sessionStorage`: Current session token (tab-isolated)

### Encryption Process
1. **Message Encryption**: Client-side encryption using recipient's public key
2. **Shared Key Derivation**: ECDH for symmetric key establishment
3. **Key Storage**: Private keys stored per-user to prevent multi-tab collisions
4. **Decryption**: Messages decrypted using stored private keys

### Real-Time Communication
- Socket.IO events for instant message delivery
- Automatic reconnection handling
- Real-time user online status
- Bi-directional message synchronization

### Security Considerations
- All sensitive data encrypted before transmission
- Tokens validated on each request
- Password hashed using bcryptjs (10 salt rounds)
- CORS enabled for frontend-backend communication
- Environment variables for sensitive configuration

## 🎮 Usage Guide

### Creating an Account
1. Navigate to the Register page
2. Enter username and password
3. Submit the form
4. Crypto keys are generated automatically
5. Redirect to Chat interface

### Starting a Conversation
1. Use the Search User component to find users
2. Click to initiate a chat
3. Chat appears in the sidebar
4. Click to open the conversation

### Sending Messages
1. Select a chat from the sidebar
2. Type your message in the input field
3. Click send or press Enter
4. Message is encrypted and sent in real-time

### Typing Awareness
- The app displays a live typing indicator while the other party is composing a message.
- This gives immediate feedback in the chat thread and improves real-time conversation flow.

### Security Features
- Open the Security Panel to verify encryption status
- All messages show "end-to-end encrypted" banner
- Last seen status for offline users

## 📱 Responsive Design

The application adapts to different screen sizes:

- **Desktop (>1200px)**: Three-column layout (sidebar | chat | security panel)
- **Tablet (860px - 1200px)**: Two-column layout (sidebar | chat)
- **Mobile (<860px)**: Full-screen chat with sidebar toggle

## 🔧 API Endpoints

### User Routes
- `POST /user/register` - Register new user
- `POST /user/login` - Login user
- `POST /user/logout` - Logout user
- `POST /user/validate` - Validate JWT token
- `GET /user/search/:query` - Search for users

### Chat Routes
- `POST /chat/create` - Create new chat
- `GET /chat` - Get all user chats
- `GET /chat/:chatId` - Get specific chat

### Message Routes
- `POST /message/send` - Send encrypted message
- `GET /message/:chatId` - Get messages for a chat
- `PUT /message/:messageId` - Update message
- `DELETE /message/:messageId` - Delete message

## 🧪 Development

### Running Tests
```bash
cd client
npm run test

cd ../server
npm run test
```

### Build for Production
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm run build
```

## ⚠️ Security Notes

- **Never commit `.env` files** to version control
- **Private keys** are generated and stored locally - losing them means losing access to old messages
- **Passwords** should be strong and unique
- **HTTPS** should be used in production
- **CORS** should be properly configured for production domains

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🐛 Known Issues & Limitations

- Private keys are stored in browser storage (consider using IndexedDB for production)
- Message history limited to current session (implement database-level encryption for persistence)
- Mobile UI optimized for portrait mode

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation above

## 🎯 Roadmap

- [ ] Group chat support
- [ ] File sharing with encryption
- [ ] Message reactions and replies
- [ ] Voice/Video calling
- [ ] Message search functionality
- [ ] Dark/Light theme toggle
- [ ] Profile customization
- [ ] Push notifications

---

**Made with ❤️ for secure communication**
