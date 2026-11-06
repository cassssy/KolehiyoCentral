import upLogo from "../assets/logos/up.svg";
import ateneoLogo from "../assets/logos/ateneo.svg";
import dlsuLogo from "../assets/logos/dlsu.png";
import ustLogo from "../assets/logos/ust.svg";

const LOGOS: Record<string, string> = {
  up: upLogo,
  ateneo: ateneoLogo,
  dlsu: dlsuLogo,
  ust: ustLogo,
};

export function UniversityLogo({
  id,
  name,
  className = "",
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const logoSrc = LOGOS[id];

  if (!logoSrc) {
    return (
      <span className={className ? `mark ${className}` : "mark"} aria-hidden="true">
        {name}
      </span>
    );
  }

  return (
    <span className={className ? `uni-logo ${className}` : "uni-logo"} aria-hidden="true">
      <img src={logoSrc} alt="" className="uni-logo-img" />
    </span>
  );
}

