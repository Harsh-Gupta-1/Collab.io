import { Users, Layers, Zap } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Users,
      title: "1. Create or Join",
      description: "Create a new room or join an existing one using a room ID. Invite team members instantly.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Layers,
      title: "2. Choose Your Mode",
      description: "Switch between whiteboard, code editor, or split view modes based on your current task.",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: Zap,
      title: "3. Collaborate Live",
      description: "Work together in real-time with live cursors, instant sync, and seamless communication.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
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
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                  <IconComponent className={`w-8 h-8 ${step.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}