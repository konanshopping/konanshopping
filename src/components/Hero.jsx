import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "85vh",
        background: "#f8f1e7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px",
        boxSizing: "border-box",
        flexWrap: "wrap",
      }}
    >
      {/* TEXTE */}

      <div
        style={{
          flex: 1,
          minWidth: "350px",
        }}
      >
        <h1
          style={{
            fontSize: "85px",
            margin: 0,
            lineHeight: "1.1",
          }}
        >
          <span style={{ color: "black" }}>
            Konan
          </span>

          <span style={{ color: "#ff8c00" }}>
            Shopping
          </span>
        </h1>

        <h2
          style={{
            fontSize: "45px",
            marginTop: "20px",
          }}
        >
          Votre boutique en ligne de confiance
        </h2>

        <p
          style={{
            fontSize: "22px",
            color: "#555",
            maxWidth: "700px",
            lineHeight: "1.7",
          }}
        >
          Découvrez des produits de qualité à
          prix imbattables. Livraison rapide,
          paiement sécurisé et service client
          disponible 24h/24.
        </p>

        {/* ICÔNES */}

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3>🔒 Paiement sécurisé</h3>
          </div>

          <div>
            <h3>🚚 Livraison rapide</h3>
          </div>

          <div>
            <h3>🎧 Service client</h3>
          </div>
        </div>

        {/* BOUTON */}

        <Link to="/boutique">
          <button
            style={{
              marginTop: "50px",
              background: "#ff8c00",
              color: "white",
              border: "none",
              padding: "20px 45px",
              borderRadius: "15px",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Découvrir nos produits →
          </button>
        </Link>
      </div>

      {/* IMAGE */}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          minWidth: "350px",
        }}
      >
        <img
          src="/hero.png"
          alt=""
          style={{
            width: "100%",
            maxWidth: "650px",
          }}
        />
      </div>
    </div>
  );
}

export default Hero;