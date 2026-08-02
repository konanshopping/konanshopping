import { useEffect, useState } from "react";
import {
  FaDownload,
  FaTimes,
  FaMobileAlt,
  FaBolt,
  FaGift,
} from "react-icons/fa";

export default function InstallPopup() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("hideInstallPopup"))
      return;

    const handler = (e) => {

console.log("beforeinstallprompt déclenché");

      e.preventDefault();
      setPrompt(e);

      setTimeout(() => {
        setShow(true);
      }, 3000);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
  }, []);

  const install = async () => {
    if (!prompt) return;

    prompt.prompt();

    const { outcome } =
      await prompt.userChoice;

    if (outcome === "accepted") {
      setShow(false);
    }

    setPrompt(null);
  };

  const close = () => {
    setShow(false);

    localStorage.setItem(
      "hideInstallPopup",
      "true"
    );
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#fff",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          padding: "22px",
          boxShadow:
            "0 -10px 40px rgba(0,0,0,.25)",
          animation:
            "popup .35s ease",
          position: "relative",
        }}
      >
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#777",
            fontSize: "18px",
          }}
        >
          <FaTimes />
        </button>

        <div
          style={{
            width: 70,
            height: 70,
            margin: "0 auto",
            borderRadius: 20,
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: 30,
          }}
        >
          <FaMobileAlt />
        </div>

        <h2
          style={{
            textAlign: "center",
            marginTop: 20,
            marginBottom: 10,
            color: "#111827",
          }}
        >
          Installer Konan Shopping
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Installez Konan Shopping pour profiter
          d'une expérience plus rapide et accéder
          facilement à vos commandes.
        </p>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <FaBolt
              color="#2563eb"
            />{" "}
            Navigation plus rapide
          </div>

          <div>
            <FaGift
              color="#2563eb"
            />{" "}
            Promotions exclusives
          </div>

          <div>
            <FaMobileAlt
              color="#2563eb"
            />{" "}
            Accès depuis l'écran d'accueil
          </div>
        </div>

        <button
          onClick={install}
          style={{
            marginTop: 25,
            width: "100%",
            height: 55,
            border: "none",
            borderRadius: 15,
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <FaDownload />
          Installer maintenant
        </button>

        <button
          onClick={close}
          style={{
            marginTop: 12,
            width: "100%",
            height: 50,
            border: "none",
            background: "#f3f4f6",
            borderRadius: 15,
            color: "#374151",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Plus tard
        </button>

        <style>{`
          @keyframes popup{
            from{
              transform:translateY(100%);
            }
            to{
              transform:translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}