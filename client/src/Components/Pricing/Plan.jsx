import { useState } from "react";
import styles from "./PricingPopup.module.css";

const plans = [
    {
        id: "lite",
        name: "Lite",
        icon: "⚡",
        desc: "Most affordable plan to get started quickly.",
        monthlyPrice: 29,
        yearlyPrice: 22,
        features: ["Unlimited sending", "Email marketing", "Send newsletters", "Up to 5 users"],
        featured: false,
    },
    {
        id: "plus",
        name: "Plus",
        icon: "🚀",
        desc: "896 clients chose this. Best value for growing teams.",
        monthlyPrice: 89,
        yearlyPrice: 67,
        features: ["Everything in Lite", "Email marketing", "Advanced analytics", "Up to 25 users", "Priority support"],
        featured: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        icon: "🏢",
        desc: "For larger businesses seeking advanced services.",
        monthlyPrice: 159,
        yearlyPrice: 119,
        features: ["Everything in Plus", "Custom integrations", "Dedicated manager", "Up to 50 users", "SLA guarantee"],
        featured: false,
    },
];

function CheckIcon({ featured }) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill={featured ? "rgba(255,255,255,0.2)" : "#EDE9FE"} />
            <path d="M5 8l2 2 4-4" stroke={featured ? "#fff" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlanCard({ plan, billing, onSelect }) {
    const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    const f = plan.featured;

    return (
        <div className={`${styles.card} ${f ? styles.featured : ""}`}>
            {f && <span className={styles.popularBadge}>⭐ Most Popular</span>}

            <div className={`${styles.iconWrap} ${f ? styles.featuredIcon : ""}`}>
                {plan.icon}
            </div>

            <p className={`${styles.planLabel} ${f ? styles.featuredLabel : ""}`}>
                {plan.name}
            </p>

            <div className={styles.priceRow}>
                <span className={`${styles.priceBig} ${f ? styles.featuredPrice : ""}`}>
                    ${price}
                </span>
                <span className={`${styles.pricePer} ${f ? styles.featuredPer : ""}`}>
                    /mo
                </span>
            </div>

            <p className={`${styles.cardDesc} ${f ? styles.featuredDesc : ""}`}>
                {plan.desc}
            </p>

            <div className={`${styles.divider} ${f ? styles.featuredDivider : ""}`} />

            <ul className={styles.featureList}>
                {plan.features.map((feat) => (
                    <li key={feat} className={`${styles.featureItem} ${f ? styles.featuredItem : ""}`}>
                        <CheckIcon featured={f} />
                        {feat}
                    </li>
                ))}
            </ul>

            <button
                className={`${styles.ctaBtn} ${f ? styles.featuredBtn : ""}`}
                onClick={() => onSelect(plan)}
            >
                Get started →
            </button>
        </div>
    );
}

export default function PricingPopup() {
    const [open, setOpen] = useState(true);
    const [billing, setBilling] = useState("monthly");

    if (!open) {
        return (
            <div className={styles.fallback}>
                <button className={styles.fallbackBtn} onClick={() => setOpen(true)}>
                    View Pricing
                </button>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
            <div className={styles.popup}>

                <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
                    ×
                </button>

                <div className={styles.header}>
                    <span className={styles.pricingBadge}>Pricing</span>
                    <h1>Choose your plan</h1>
                    <p>No contracts, no surprise fees. Cancel anytime.</p>
                </div>

                <div className={styles.toggleWrap}>
                    <div className={styles.toggleInner}>
                        {["monthly", "yearly"].map(b => (
                            <button
                                key={b}
                                className={`${styles.toggleBtn} ${billing === b ? styles.active : ""}`}
                                onClick={() => setBilling(b)}
                            >
                                {b === "monthly" ? "Monthly" : "Yearly"}
                                {b === "yearly" && <span className={styles.saveBadge}>−25%</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.cardsGrid}>
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            billing={billing}
                            onSelect={p => alert(`Selected: ${p.name}`)}
                        />
                    ))}
                </div>

                <div className={styles.footer}>
                    🔒 Secured payments via Stripe &nbsp;·&nbsp; 14-day free trial on all plans
                </div>

            </div>
        </div>
    );
}