// Data/plan.js
export const plans = [
  {
    id: "free",
    name: "Free",
    icon: "🆓",
    desc: "Perfect for trying out our tools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 10,
    stripePriceId: {
      monthly: null,   // free plan — no stripe
      yearly: null,
    },
    features: [
      "10 lifetime credits",
      "Article generator",
      "Title generator",
      "Basic support",
    ],
    featured: false,
  },
  {
    id: "basic",
    name: "Basic",
    icon: "⚡",
    desc: "Great for regular content creators",
    monthlyPrice: 9,
    yearlyPrice: 81,   // 25% off
    credits: 50,
    stripePriceId: {
      monthly: "price_1TeCauIfIySYEIdXNcSJ00AL",
      yearly: "price_1TeCoXIfIySYEIdXxv1NxeEm",
    },
    features: [
      "50 credits/month",
      "Article generator",
      "Title generator",
      "Image generator",
      "Priority support",
    ],
    featured: false,
  },
  {
    id: "premium",
    name: "Premium",
    icon: "💎",
    desc: "For power users and teams",
    monthlyPrice: 19,
    yearlyPrice: 171,  // 25% off
    credits: 200,
    stripePriceId: {
      monthly: "price_1TeCrIIfIySYEIdXv8qEyks2",
      yearly: "price_1TeCsDIfIySYEIdXao4kZzP6",
    },
    features: [
      "200 credits/month",
      "All generators",
      "Background remover",
      "Resume reviewer",
      "Priority support",
      "Early access to new features",
    ],
    featured: true,
  },
];