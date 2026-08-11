import "./LoaderPage.css";

export default function LoaderPage() {
  return (
    <div className="loader-page">

      {/* CERCLE + LOGO */}

      <div className="loader-circle">

        {/* CERCLE ANIMÉ */}

        <div className="loader-ring"></div>

        {/* LOGO */}

        <div className="loader-logo-wrapper">
          <img
            src="/logo.jpg"
            alt="Konan Shopping"
            className="loader-logo"
          />
        </div>

      </div>

      {/* TEXTE */}

      <div
        className="loader-text"
        translate="no"
      >
        Chargement...
      </div>

    </div>
  );
}