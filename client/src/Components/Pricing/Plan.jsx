import { useState } from "react";
import styles from "./plan.module.css";
import { plans } from "../../Data/plan";
import useLockScroll from "../../hooks/useLockScroll";
import LoginSuccessMessage from "../Auth/LoginSuccessMessage";


function CheckIcon({ featured }) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill={featured ? "rgba(255,255,255,0.2)" : "#EDE9FE"} />
            <path d="M5 8l2 2 4-4" stroke={featured ? "#fff" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlanCard({ plan, billing }) {
    const [loading, setLoading] = useState(false)
    const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    const f = plan.featured;
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    async function handleSelect() {
        if (plan.id === "free") {
            return
        }
        try {
            setLoading(true)
            const res = await fetch(`${BASE_URL}/api/payment/chekout`, {
                method: "post",
                credentials: "include",
                headers: { "Content-type": "Application/json" },
                body: JSON.stringify({
                    plan: plan.name,
                    billing: billing,
                })
            })
            const data = await res.json()
            console.log(data);
            if (data.sessionUrl) {
                setTimeout(() => {
                    window.location.href = data.sessionUrl
                }, 50)
                return
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    }

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
                    {billing === "monthly" ? "/month" : "/Year"}
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

            <button className={`${styles.ctaBtn} ${f ? styles.featuredBtn : ""}`} onClick={() => handleSelect()} disabled={loading}>
                {loading ? "Loading..." : "Get started →"}
            </button>
        </div>
    )
}

export default function Plan({ closePlanPopUp,setPlanPopUp,planPopUp}) {
    const [billing, setBilling] = useState("monthly");
    useLockScroll()
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                {planPopUp?<button className={styles.closeBtn} onClick={() => setPlanPopUp(false)} aria-label="Close"> ×</button>
                :<button className={styles.closeBtn} onClick={() => closePlanPopUp(false)} aria-label="Close"> ×</button>}
                
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