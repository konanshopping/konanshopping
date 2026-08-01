import React from "react";

function KonanLoader() {
  const mobile = window.innerWidth <= 768;

  return (
    <>
      <style>{`
        @keyframes konanSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

       @keyframes logoPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.95);
    box-shadow:
      0 0 10px rgba(75,46,131,.20),
      0 8px 22px rgba(0,0,0,.10);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.08);
    box-shadow:
      0 0 28px rgba(124,58,237,.55),
      0 12px 28px rgba(0,0,0,.18);
  }

  100% {
    transform: translate(-50%, -50%) scale(0.95);
    box-shadow:
      0 0 10px rgba(75,46,131,.20),
      0 8px 22px rgba(0,0,0,.10);
  }
}

        @keyframes fadeUp {
          from{
            opacity:0;
            transform:translateY(12px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          background: "#fff",
          animation: "fadeUp .5s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: mobile ? "100px" : "120px",
            height: mobile ? "100px" : "120px",
          }}
        >
          {/* Cercle */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "4px solid #ECECF8",
              borderTop: "4px solid #4B2E83",
              borderRight: "4px solid #7C3AED",
              borderRadius: "50%",
              animation: "konanSpin .9s linear infinite",
            }}
          />

         {/* Logo */}

<div
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: mobile ? "60px" : "74px",
    height: mobile ? "60px" : "74px",
    borderRadius: "50%",
    overflow: "hidden",
    background: "#fff",
    border: "3px solid #fff",
    boxShadow:
      "0 0 18px rgba(75,46,131,.35), 0 8px 22px rgba(0,0,0,.12)",
    animation: "logoPulse 1.8s ease-in-out infinite",
    zIndex: 2,
  }}
>
  <img
    src="/logo.jpg"
    alt="Konan Shopping"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
</div>
        </div>

        <h2
          translate="no"
          style={{
            marginTop: "30px",
            color: "#4B2E83",
            fontSize: mobile ? "20px" : "24px",
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          Bienvenue sur KONAN SHOPPING
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#6B7280",
            fontSize: mobile ? "13px" : "15px",
            textAlign: "center",
            maxWidth: "320px",
            lineHeight: "22px",
          }}
        >
          Préparation de votre expérience d'achat...
        </p>
      </div>
    </>
  );
}

export default KonanLoader;