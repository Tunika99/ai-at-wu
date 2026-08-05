type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function stroked(path: React.ReactNode, className?: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return stroked(
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />,
    className,
  );
}

export function NodesIcon({ className }: IconProps) {
  return stroked(
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="8" r="2.4" />
      <circle cx="11" cy="18" r="2.4" />
      <path d="M8.2 7 15.7 8M7 8.2l3 7.6M15.9 9.9l-3.5 6" />
    </>,
    className,
  );
}

export function LockIcon({ className }: IconProps) {
  return stroked(
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </>,
    className,
  );
}

export function RocketIcon({ className }: IconProps) {
  return stroked(
    <>
      <path d="M12 15.5c5.5-4 7-8.5 6.8-12.3-3.8-.2-8.3 1.3-12.3 6.8" />
      <path d="M9.5 8.5 4 10.5l3 3M15.5 14.5 13.5 20l-3-3M4.8 16.2c-1 1-1.6 3-1.6 4.6 1.6 0 3.6-.6 4.6-1.6" />
      <circle cx="14" cy="10" r="1.5" />
    </>,
    className,
  );
}

export function GlobeIcon({ className }: IconProps) {
  return stroked(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.6 4 5.7 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.7-4-9s1.2-6.4 4-9Z" />
    </>,
    className,
  );
}

export function UsersIcon({ className }: IconProps) {
  return stroked(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M16 5.2a3.2 3.2 0 0 1 0 5.9M17.5 15.4c1.8.6 2.7 2.2 3 4.6" />
    </>,
    className,
  );
}
