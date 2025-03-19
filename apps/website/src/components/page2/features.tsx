import { Brain, Cloud, Shield, Zap } from "lucide-react";

const features = [
  {
    name: "AI-Powered Analytics",
    description:
      "Harness the power of machine learning to derive actionable insights from your data.",
    icon: Brain,
  },
  {
    name: "Cloud-Native Architecture",
    description:
      "Scalable, resilient, and efficient solutions built for the modern cloud ecosystem.",
    icon: Cloud,
  },
  {
    name: "Enterprise-Grade Security",
    description:
      "State-of-the-art security measures to protect your most valuable assets.",
    icon: Shield,
  },
  {
    name: "High-Performance Systems",
    description:
      "Optimized for speed and efficiency, our solutions deliver unparalleled performance.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Cutting-Edge Solutions
        </h2>
        <p className="text-muted-foreground mt-4 sm:text-lg">
          Discover how Amane Soft can transform your business with our
          innovative technologies.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="bg-background relative overflow-hidden rounded-lg border p-8"
          >
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="text-muted-foreground mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
