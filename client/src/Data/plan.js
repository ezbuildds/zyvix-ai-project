export const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: "⚡",
    desc: "Perfect for testing AI tools and small projects.",
    monthlyPrice: 9,
    yearlyPrice: 70,
    features: [
      "100 Credits / month",
      "AI Article Generator",
      "AI Title Generator",
      "Background Remover",
      "Standard Speed",
      "Email Support"
    ],
    featured: false,
  },

  {
    id: "pro",
    name: "Pro",
    icon: "🚀",
    desc: "Best for creators, freelancers and daily AI users.",
    monthlyPrice: 19,
    yearlyPrice: 200,
    features: [
      "500 Credits / month",
      "Everything in Starter",
      "AI Image Generator",
      "Priority Processing",
      "Commercial Usage",
      "Generation History"
    ],
    featured: true,
  },

  {
    id: "unlimited",
    name: "Scale",
    icon: "👑",
    desc: "Built for agencies and businesses with heavy workloads.",
    monthlyPrice: 49,
    yearlyPrice: 300,
    features: [
      "2500 Credits / month",
      "Everything in Pro",
      "Fastest Queue",
      "API Access (Soon)",
      "Team Workspace",
      "Priority Support"
    ],
    featured: false,
  },
];