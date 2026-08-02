import "./LoaderPage.css";

export default function LoaderPage() {
  return (
    <div className="loader-page">

      <div className="loader-circle">

        <div className="loader-ring"></div>

        <img
          src="/logo.jpg"
          alt="Konan Shopping"
          className="loader-logo"
        />

      </div>

      <div className="loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>
  );
}