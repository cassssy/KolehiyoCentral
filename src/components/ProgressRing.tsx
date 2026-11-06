export function ProgressRing({
  value,
  max,
  size = 46,
  strokeWidth = 4,
  className = "",
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const isComplete = max > 0 && value === max;

  return (
    <div
      className={`progress-ring-wrap ${isComplete ? "is-complete" : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${percent}% completed`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-ring-svg">
        <circle
          className="progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="progress-ring-label">
        {isComplete ? (
          <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          `${value}/${max}`
        )}
      </span>
    </div>
  );
}

