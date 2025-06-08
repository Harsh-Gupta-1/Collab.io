import { Code, Mail, Github, Linkedin } from "lucide-react";

export default function Footer({ 
  scrollToSection, 
  setShowSignupModal 
}) {
  return (
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
  );
}