export function LogoIcon() {
  return (
  <svg width="48" height="48" viewBox="20 20 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="pulseGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#9381ff" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g filter="url(#pulseGlow)">
    <circle cx="60" cy="60" r="30" stroke="#9381ff" stroke-width="6" opacity="0.25"/>
    <circle cx="60" cy="60" r="18" fill="#9381ff"/>
    <path d="M24 60H44L52 46L68 74L76 60H96"
      stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
  );
}
export const StarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
export const DiamondIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" /><path d="M6 3l4 6m8-6l-4 6" />
    </svg>
);
export const SparkleIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
    </svg>
);
export const BoltSmIcon = ({ color = "#F0C050" }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} />
    </svg>
);
export const HomeIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
export const PenIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);
export const HashIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
);
export const ImageIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);
export const EraserIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" /><path d="M6.5 17.5l4-4" />
    </svg>
);
export const DocIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);
export const UsersIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);
export const LogoutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
export const TotalGenerateIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M12 3L20 7V17L12 21L4 17V7L12 3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </svg>
);
export const ArticalIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M8 6H18M8 12H18M8 18H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M4 6H4.01M4 12H4.01M4 18H4.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
export const TitleIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M6 7H18M6 12H14M6 17H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
export const ImageGenerateIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
        />
        <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
        <path
            d="M21 16L16 11L5 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </svg>
);
export const RemoveIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M14 14L20 20M20 14L14 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
export const ReviewIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M7 3H17L21 7V21H7V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <path
            d="M17 3V7H21"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M10 12H18M10 16H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
export const CommunityIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M8 13C10.2091 13 12 11.2091 12 9C12 6.79086 10.2091 5 8 5C5.79086 5 4 6.79086 4 9C4 11.2091 5.79086 13 8 13Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M2 19C2 16.7909 3.79086 15 6 15H10C12.2091 15 14 16.7909 14 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M14 18C14.5 16.5 15.8 15.5 17.5 15.5H18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
export const CreditIcon = () => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
            d="M13 2L4 14H11L10 22L20 9H13L13 2Z"
            fill="currentColor"
        />
    </svg>
);