import {
  PenTool,
  Code,
  MessageSquare,
  Share2,
  Layers,
  Shield
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: PenTool,
      title: "Interactive Whiteboard",
      description: "Draw, sketch, and brainstorm together with real-time collaboration and multiple drawing tools.",
      gradient: "from-purple-50 to-indigo-50",
      border: "border-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Code,
      title: "Live Code Editor",
      description: "Write JavaScript code together with syntax highlighting and real-time editing. More languages coming soon!",
      gradient: "from-blue-50 to-purple-50",
      border: "border-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Integrated Chat",
      description: "Communicate instantly with your team without leaving your workspace. Always stay connected.",
      gradient: "from-green-50 to-blue-50",
      border: "border-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Share2,
      title: "Easy Room Sharing",
      description: "Share room IDs instantly with team members. No complex setup or installation required.",
      gradient: "from-indigo-50 to-purple-50",
      border: "border-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: Layers,
      title: "Multiple View Modes",
      description: "Switch between whiteboard, code editor, or split view modes to match your workflow.",
      gradient: "from-purple-50 to-pink-50",
      border: "border-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is secure with MongoDB storage and private rooms. Full control over your workspace.",
      gradient: "from-gray-50 to-purple-50",
      border: "border-gray-100",
      iconColor: "text-gray-600"
    }
  ];

  return (
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
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-xl border ${feature.border}`}
              >
                <IconComponent className={`w-10 h-10 ${feature.iconColor} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}