import { Code } from "lucide-react";

export default function Navbar({ 
  scrollToSection, 
  setShowLoginModal, 
  setShowSignupModal 
}) {
  return (
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
  );
}