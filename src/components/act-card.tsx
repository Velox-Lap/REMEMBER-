type ActCardProps = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  theme: "garden" | "ocean" | "secret";
};

export function ActCard({
  number,
  eyebrow,
  title,
  description,
  theme,
}: ActCardProps) {
  return (
    <article className={`act-card act-card--${theme}`}>
      <div className="act-card-top">
        <span>{eyebrow}</span>
        <span>{number} / 03</span>
      </div>
      <div className="act-card-content">
        <p className="act-card-kicker">A JOURNEY THROUGH</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="act-card-orbit" aria-hidden="true" />
    </article>
  );
}
