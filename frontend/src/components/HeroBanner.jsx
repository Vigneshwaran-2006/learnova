import heroImg from '../assets/hero-banner.jpg';

export default function HeroBanner({ roadmap, onContinue, onGenerate }) {
  return (
    <div className="hero-banner">
      <div className="hero-text-col">
        <h1 className="hero-heading">Keep Learning,<br />Keep Growing!</h1>
        <p className="hero-sub">
          A personalized learning journey to help you achieve your goals.
        </p>
        {roadmap ? (
          <button className="hero-cta" onClick={onContinue}>
            Continue Learning <span>→</span>
          </button>
        ) : (
          <button className="hero-cta" onClick={onGenerate}>
            Generate My Path <span>→</span>
          </button>
        )}
      </div>

      <div className="hero-quote-col">
        <div className="hero-quote-box">
          <p className="hero-quote-text">
            "Discipline today<br />creates success<br />tomorrow."
          </p>
          <div className="hero-quote-line" />
        </div>
      </div>

      <img src={heroImg} alt="Learning journey illustration" className="hero-illustration" />
    </div>
  );
}
