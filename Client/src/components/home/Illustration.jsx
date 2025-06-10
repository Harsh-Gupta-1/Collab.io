import React, { useState, useEffect } from "react";
import { MessageSquare, Play } from "lucide-react";
export default function CollaborativeAppIllustration() {
  const [activeMode, setActiveMode] = useState("code");
  const [messages, setMessages] = useState([
    { user: "Alex", text: "Great work!", color: "bg-purple-500" },
    { user: "Sam", text: "Let's add features", color: "bg-blue-500" },
  ]);

  // Auto-cycle through modes
  useEffect(() => {
    const modes = ["code", "whiteboard", "split"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % modes.length;
      setActiveMode(modes[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);


  const renderCodeEditor = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 h-full overflow-hidden">
      <div className="flex items-center mb-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <span className="ml-3 text-xs text-gray-500">app.js</span>
      </div>

      <div className="font-mono text-xs space-y-1 text-left">
        <div className="flex">
          <span className="text-gray-400 w-6">1</span>
          <span className="text-blue-400">const</span>
          <span className="text-gray-800 ml-1">io</span>
          <span className="text-gray-800"> = </span>
          <span className="text-green-400">require</span>
          <span className="text-yellow-500">('socket.io')</span>
        </div>
        <div className="flex">
          <span className="text-gray-400 w-6">2</span>
          <span className="text-gray-500 ml-2">// Real-time collaboration</span>
        </div>
        <div className="flex">
          <span className="text-gray-400 w-6">3</span>
          <span className="text-purple-400">io</span>
          <span className="text-gray-800">.</span>
          <span className="text-blue-400">on</span>
          <span className="text-yellow-500">('connection', socket =&gt;</span>
        </div>
        <div className="flex">
          <span className="text-gray-400 w-6">4</span>
          <span className="ml-4 text-gray-800">console.</span>
          <span className="text-blue-400">log</span>
          <span className="text-yellow-500">(</span>
          <span className="text-green-300">'User connected'</span>
          <span className="text-yellow-500">)</span>
        </div>
        <div className="flex">
          <span className="text-gray-400 w-6">5</span>
          <span className="text-yellow-500">)</span>
        </div>
      </div>

      <div className="mt-3 bg-gray-50 rounded p-2">
        <div className="text-xs text-green-400">
          <span className="text-gray-500">$ </span>
          <span className="animate-pulse">Server running on port 3001</span>
        </div>
      </div>
    </div>
  );

  const renderWhiteboard = () => (
    <div className="bg-white rounded-lg p-4 h-full border-2 border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">Whiteboard</span>
      </div>

      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 200 120">
          <path
            d="M20,60 Q60,20 100,60 T180,60"
            stroke="#8B5CF6"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
          />
          <circle
            cx="50"
            cy="40"
            r="8"
            fill="#3B82F6"
            className="animate-bounce"
          />
          <rect
            x="120"
            y="30"
            width="20"
            height="20"
            fill="#10B981"
            className="animate-pulse"
          />
          <path
            d="M160,80 L180,60 L180,80 Z"
            fill="#F59E0B"
            className="animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>
    </div>
  );

  const renderSplitView = () => (
    <div className="h-full flex space-x-2">
      <div className="w-1/2">{renderWhiteboard()}</div>
      <div className="w-1/2">{renderCodeEditor()}</div>
    </div>
  );

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Navigation Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-lg">CollabSpace</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Live</span>
              </div>
            </div>
            <div className="flex space-x-4">
              {[
                { id: "whiteboard", label: "Draw" },
                { id: "code", label: "Code" },
                { id: "split", label: "Both" },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveMode(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeMode === id
                      ? "bg-purple-100 text-purple-700 shadow-md"
                      : "text-white"
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"></div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-xs text-white font-bold">H</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-80">
          {/* Content Area */}
          <div className="flex-1 p-4 w-2/3">
            <div className="h-full transition-all duration-500 ease-in-out">
              {activeMode === "code" && renderCodeEditor()}
              {activeMode === "whiteboard" && renderWhiteboard()}
              {activeMode === "split" && renderSplitView()}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-1/3 bg-white border border-gray-200 rounded-lg flex flex-col shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                
                <span className="text-sm font-semibold text-gray-800">
                  Team Chat
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div
                    className={`w-8 h-8 ${msg.color} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-xs text-white font-bold">
                      {msg.user[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-800 mb-1">
                      {msg.user}
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 text-sm bg-gray-100 rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  readOnly
                />
                <button className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <Play className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-300 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-indigo-300 rounded-full opacity-40 animate-bounce"></div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `,
        }}
      />
    </div>
  );
}
