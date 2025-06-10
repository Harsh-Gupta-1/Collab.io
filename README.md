# CollabSpace

A real-time collaborative platform that enables teams to work together seamlessly through integrated whiteboard, code editor, and chat features. Built with the MERN stack and Socket.IO for real-time communication.

## ✨ Features

### 🔐 User Authentication
- Secure login and signup system
- Personalized dashboard for each user
- Session management and user profiles

### 🏠 Room Management
- **Create Room**: Start new collaborative sessions
- **Join Room**: Connect to existing rooms with room codes
- **Room History**: View and rejoin previously accessed rooms
- Real-time participant tracking

### 🎨 Interactive Whiteboard
- **Drawing Tools**: Pencil tool for freehand drawing
- **Text Tool**: Add and edit text directly on the whiteboard
- **Shapes**: Circle, rectangle, and triangle tools
- **Selection Tools**: 
  - Select and move objects
  - Select and delete functionality
- **Canvas Controls**:
  - Drag and move canvas for navigation
  - Zoom in/out with zoom indicator
  - Clear entire canvas
- **Customization**:
  - Color picker for drawing tools
  - Adjustable line thickness
- **Real-time Collaboration**: See changes from all participants instantly

### 💻 Code Editor
- **Language Support**: JavaScript programming
- **Live Collaboration**: Multiple users can edit simultaneously
- **Output Terminal**: Integrated terminal window displaying code execution results
- **Real-time Synchronization**: Changes appear instantly for all participants

### 💬 Chat Panel
- **Real-time Messaging**: Instant communication between participants
- **Online Presence**: View number of online users and their names
- **Persistent Chat**: Messages remain visible throughout the session

### 🔄 Viewing Modes
- **Whiteboard Mode**: Full-screen whiteboard experience
- **Code Editor Mode**: Dedicated coding environment
- **Split View**: Combined view with chat panel on the right side

## 🛠️ Tech Stack

### Frontend
- **React.js**: User interface and component management
- **Socket.IO Client**: Real-time communication
- **Fabric.js**: Interactive whiteboard canvas functionality

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication
- **MongoDB**: Database for user data and room information

### Additional Technologies
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Fabric.js**: Advanced canvas manipulation and drawing tools

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-Gupta-1/CollabSpace.git
   cd CollabSpace
   ```

2. **Install backend dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../Client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/collaborative-app
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Run the application**
   
   Backend (from Server directory):
   ```bash
   npm start
   ```
   
   Frontend (from Client directory):
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Dashboard**: View your profile and room options
3. **Create or Join Room**: Start a new collaborative session or join an existing one
4. **Collaborate**: 
   - Switch between whiteboard and code editor modes
   - Use the chat panel to communicate with team members
   - See real-time changes from all participants
5. **Room History**: Access previously joined rooms from your dashboard

## 🔧 Socket Events

The application uses various socket events for real-time functionality:

- **Room Management**: `join-room`, `leave-room`, `user-joined`, `user-left`
- **Whiteboard**: `draw`, `shape-added`, `object-moved`, `canvas-cleared`
- **Code Editor**: `code-change`, `cursor-position`
- **Chat**: `message`, `typing`, `stop-typing`
- **User Presence**: `user-online`, `user-offline`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Future Enhancements

- Support for additional programming languages in the code editor
- File upload and sharing capabilities
- Voice and video chat integration
- Advanced whiteboard tools (text, arrows, connectors)
- Room permissions and moderation features
- Export functionality for whiteboard and code

## 🙏 Acknowledgments

- Socket.IO for real-time communication capabilities
- Fabric.js for powerful canvas manipulation
- MongoDB for reliable data storage
- React community for excellent frontend tools

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using the MERN Stack, Socket.IO, and Fabric.js**
