import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Illustration from "../components/Illustration";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Code,
  MessageSquare,
  PenTool,
  Users,
  Share2,
  Layers,
  Zap,
  Shield,
  Github,
  Mail,
  Linkedin,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Password validation
  const passwordsMatch = signupData.password === signupData.confirmPassword;
  const showPasswordMismatch =
    signupData.confirmPassword.length > 0 && !passwordsMatch;

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        backendURL + "/api/auth/login",
        loginData
      );

      const data = response.data;

      if (data.success) {
        // Note: In a real Claude artifact, localStorage isn't available
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('user', JSON.stringify(data.user));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupPayload } = signupData;
      const response = await axios.post(
        backendURL + "/api/auth/signup",
        signupPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Account created successfully! Please login.");
        setShowSignupModal(false);
        setShowLoginModal(true);
        setSignupData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        if (data.errors) {
          data.errors.forEach((error) => toast.error(error.message));
        } else {
          toast.error(data.message || "Signup failed");
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.message));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setLoginData({ email: "", password: "" });
    setSignupData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-white">
      <ToastContainer
        position="top-center"
        toastClassName="backdrop-blur-sm bg-white/90 text-gray-800 border border-purple-200"
      />

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                CollabSpace
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Code, Draw &
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    {" "}
                    Collaborate
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                  Real-time collaborative workspace where teams can code
                  together, brainstorm on whiteboards, and communicate
                  seamlessly - all in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl font-semibold transition-all duration-200"
                >
                  Learn More
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Secure & private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No setup required</span>
                </div>
              </div>
            </div>

            {/* Right Side - Simplified Illustration */}
            <div className="relative">
              <Illustration />

              {/* Floating Elements */}
              {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-200 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-200 rounded-full opacity-40"></div> */}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How CollabSpace Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to implementation, collaborate seamlessly with your team
              in real-time across multiple tools and modes.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                1. Create or Join
              </h3>
              <p className="text-gray-600">
                Create a new room or join an existing one using a room ID.
                Invite team members instantly.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                2. Choose Your Mode
              </h3>
              <p className="text-gray-600">
                Switch between whiteboard, code editor, or split view modes
                based on your current task.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                3. Collaborate Live
              </h3>
              <p className="text-gray-600">
                Work together in real-time with live cursors, instant sync, and
                seamless communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for seamless team collaboration in one
              integrated platform.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <PenTool className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interactive Whiteboard
              </h3>
              <p className="text-gray-600">
                Draw, sketch, and brainstorm together with real-time
                collaboration and multiple drawing tools.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <Code className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Live Code Editor
              </h3>
              <p className="text-gray-600">
                Write code together with syntax highlighting, real-time editing,
                and instant synchronization.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
              <MessageSquare className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Integrated Chat
              </h3>
              <p className="text-gray-600">
                Communicate instantly with your team without leaving your
                workspace. Always stay connected.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
              <Share2 className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Room Sharing
              </h3>
              <p className="text-gray-600">
                Share room IDs instantly with team members. No complex setup or
                installation required.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <Layers className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multiple View Modes
              </h3>
              <p className="text-gray-600">
                Switch between whiteboard, code editor, or split view modes to
                match your workflow.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-100">
              <Shield className="w-10 h-10 text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your data is secure with MongoDB storage and private rooms. Full
                control over your workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CollabSpace</span>
              </div>
              <p className="text-gray-400">
                Real-time collaborative workspace for teams to code, draw, and
                communicate together.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connect</h3>

              {/* Email shown plainly */}
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>contact@harshgupta2706@gmail.com</span>
              </div>

              {/* Socials as icons */}
              <div className="flex space-x-4 mt-2">
                <a
                  href="https://github.com/Harsh-Gupta-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/harsh-gupta-9b6a74301/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 CollabSpace. Built with ❤️ for better collaboration. <br />
              <span className="text-sm text-gray-500">
                Crafted by{" "}
                <span className="text-white font-semibold">Harsh Gupta</span>
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Welcome Back
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 pr-12 rounded-xl transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowSignupModal(true);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Create Account
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      className="w-full bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 pr-12 rounded-xl transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showSignupPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain at least one uppercase, lowercase, and number
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full bg-white border-2 ${
                        showPasswordMismatch
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : signupData.confirmPassword.length > 0 &&
                            passwordsMatch
                          ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                          : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                      } text-gray-800 px-4 py-3 pr-12 rounded-xl transition-all duration-200`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {showPasswordMismatch && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                  {signupData.confirmPassword.length > 0 && passwordsMatch && (
                    <p className="text-xs text-green-500 mt-1">
                      Passwords match
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || showPasswordMismatch}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setShowSignupModal(false);
                      setShowLoginModal(true);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
