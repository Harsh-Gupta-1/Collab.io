import Illustration from "./Illustration";

export default function HeroSection({ 
  setShowSignupModal, 
  scrollToSection 
}) {
  return (
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

          {/* Right Side - Illustration */}
          <div className="relative">
            <Illustration />
          </div>
        </div>
      </div>
    </section>
  );
}