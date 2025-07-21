# JWT Authentication System with React & Node.js

A modern, full-stack authentication system built with React, Node.js, and MongoDB featuring JWT tokens, refresh tokens, password strength validation, dark mode, and enhanced security features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)

## ✨ Features

### 🔐 **Authentication & Security**
- **JWT Token Authentication** with refresh token system
- **Account Lockout Protection** - locks account after 5 failed attempts for 15 minutes
- **Session Management** with automatic timeout warnings (2 minutes before expiry)
- **Password Strength Meter** with real-time validation and requirements display[1]
- **Remember Me** functionality for persistent login sessions
- **Secure Logout** with token blacklisting and cleanup

### 🎨 **User Interface**
- **Dark/Light Mode Toggle** with smooth synchronized transitions[1]
- **Responsive Design** optimized for desktop, tablet, and mobile devices
- **Smooth Animations** with carefully timed micro-interactions
- **Modern Minimalist UI** using Tailwind CSS utility classes
- **Form Validation** with real-time feedback and error handling
- **Password Visibility Toggle** with animated eye icons

### 🛡️ **Advanced Security Features**
- **Rate Limiting** on login attempts (10 attempts per 15 minutes)
- **Password Requirements** enforcement (8+ chars, uppercase, lowercase, numbers, special chars)
- **Token Expiration** handling with automatic refresh
- **Automatic Session Extension** using refresh tokens
- **Protected Routes** with authentication checks
- **Account Lockout** with countdown timer display

### 🚀 **Performance & UX**
- **Fast Loading** with optimized React components
- **Smooth Page Transitions** with consistent animation timing
- **Auto-fill Username** from previous "Remember Me" logins
- **Loading States** with visual feedback during API calls
- **Error Boundaries** for graceful error handling

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and function components
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling and validation
- **Axios** - HTTP client with request/response interceptors

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimal web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and salting
- **express-rate-limit** - Rate limiting middleware
- **cors** - Cross-Origin Resource Sharing

## 🌐 Usage

### **Access the Application**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### **Test Accounts**
Create a new account or use these test credentials:
- **Username:** `testuser`
- **Password:** `TestPass123!`

### **API Endpoints**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/register` | User registration | No |
| POST | `/login` | User authentication | No |
| POST | `/logout` | User logout | Yes |
| POST | `/refresh` | Refresh access token | Refresh Token |
| GET | `/protected` | Access protected resource | Yes |

### **Frontend Routes**

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/dashboard` |
| `/login` | Login | User authentication page |
| `/register` | Register | User registration page |
| `/dashboard` | Dashboard | Protected user dashboard |

## 📁 Project Structure

### **Frontend (React Application)**
- `frontend/public/` - Static public assets
- `frontend/src/components/` - React components
  - `Login.jsx` - Login form component
  - `Register.jsx` - Registration form component
  - `Dashboard.jsx` - User dashboard component
  - `ProtectedRoute.jsx` - Route protection wrapper
  - `PasswordStrengthMeter.jsx` - Password validation component
  - `SessionTimeoutWarning.jsx` - Session management modal
  - `DarkModeToggle.jsx` - Theme toggle component
- `frontend/src/contexts/` - React contexts
  - `AuthContext.jsx` - Authentication state management
  - `DarkModeContext.jsx` - Theme state management
- `frontend/src/services/` - API services
  - `api.js` - Axios configuration and API calls
- `frontend/src/App.jsx` - Main app component
- `frontend/src/main.jsx` - React entry point
- `frontend/src/index.css` - Global styles and Tailwind imports

### **Backend (Node.js Application)**
- `backend/models/` - Database models
  - `User.js` - User schema and model
- `backend/middleware/` - Express middleware
  - `auth.js` - JWT authentication middleware
- `backend/server.js` - Main server file
- `backend/package.json` - Backend dependencies
- `backend/.env` - Environment variables (not in repo)

### **Root Files**
- `.gitignore` - Git ignore rules
- `README.md` - Project documentation
- `LICENSE` - MIT license file
```


## 🧪 Testing

### **Manual Testing Checklist**

**Registration Flow:**
- [ ] Test password strength validation
- [ ] Try registering with existing username
- [ ] Verify account creation success
- [ ] Check password requirements feedback

**Authentication Flow:**
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Test account lockout (5 failed attempts)
- [ ] Verify lockout countdown timer
- [ ] Test "Remember Me" functionality

**Session Management:**
- [ ] Test session timeout warning
- [ ] Verify automatic logout on expiry
- [ ] Test session extension functionality
- [ ] Check refresh token rotation

**UI/UX Testing:**
- [ ] Test dark/light mode toggle
- [ ] Verify responsive design on mobile
- [ ] Check smooth animations and transitions
- [ ] Test password visibility toggle

## 📈 Performance Optimization

### **Frontend Optimizations**
- **Code Splitting** with React.lazy()
- **Memoization** with React.memo()
- **Bundle Analysis** with Vite bundle analyzer
- **Image Optimization** with modern formats

### **Backend Optimizations**
- **Database Indexing** on frequently queried fields
- **Request Compression** with compression middleware
- **Caching** with Redis for session storage
- **Rate Limiting** to prevent abuse

## 🔒 Security Best Practices

### **Implemented Security Measures**
✅ **Password Hashing** with bcrypt (10 rounds)  
✅ **JWT Security** with secure secrets and short expiry  
✅ **Rate Limiting** on authentication endpoints  
✅ **Account Lockout** after failed attempts  
✅ **Token Blacklisting** on logout  
✅ **Input Validation** and sanitization  
✅ **CORS Configuration** for cross-origin requests  
✅ **Environment Variables** for sensitive data  

### **Additional Security Recommendations**
- Implement HTTPS in production
- Add request logging and monitoring
- Set up security headers with helmet.js
- Implement 2FA for enhanced security
- Add API request validation with Joi
- Set up automated security scanning

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/jwt-auth-system.git`
3. Create feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install` (in both frontend and backend)
5. Make your changes
6. Test thoroughly
7. Commit: `git commit -m 'Add some amazing feature'`
8. Push: `git push origin feature/amazing-feature`
9. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Include clear description of changes in PR

## 📚 Learning Resources

### **Technologies Used**
- [React Documentation](https://reactjs.org/docs) - Learn React fundamentals
- [Node.js Guide](https://nodejs.org/en/docs/) - Server-side JavaScript
- [MongoDB Manual](https://docs.mongodb.com/) - Database operations
- [JWT Introduction](https://jwt.io/introduction/) - Understanding JSON Web Tokens
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility-first CSS

### **Advanced Topics**
- [React Security Best Practices](https://blog.logrocket.com/react-security-best-practices/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [MongoDB Security Guide](https://docs.mongodb.com/manual/security/)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Warranty
- ❌ Liability

## 🙏 Acknowledgments

Special thanks to:
- **React Team** - For the amazing React framework
- **MongoDB** - For the flexible NoSQL database
- **Tailwind CSS** - For the utility-first CSS approach
- **Vite Team** - For the blazing fast build tool
- **Express.js** - For the minimal web framework
- **Open Source Community** - For the incredible tools and libraries

## 👨‍💻 Author

**RonnieSamHoro**
- 🐙 **GitHub:** [@RonnieSamHoro](https://github.com/RonnieSamHoro)

## 💬 Support

- **Documentation:** This README and inline code comments
- **Issues:** [GitHub Issues](https://github.com/RonnieSamHoro/jwt-auth-system/issues)
- **Discussions:** [GitHub Discussions](https://github.com/RonnieSamHoro/jwt-auth-system/discussions)

---

### 🌟 **Star this repository if you found it helpful!**

**Made with ❤️ using React, Node.js, and MongoDB**

*Last updated: July 2025*
