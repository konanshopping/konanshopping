import { useState, useEffect } from "react";
import axios from "axios";

import {
  FaEnvelope,
  FaPaperPlane,
  FaUsers,
  FaBell,
  FaBullhorn,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";

function AdminMessages() {

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

    const [target, setTarget] =
  useState("all");

  const [messages, setMessages] =
    useState([]);

  const [messagesCount, setMessagesCount] =
    useState(0);

  const [clientsCount, setClientsCount] =
    useState(0);

  /* =========================
     MODE ÉDITION
  ========================= */

  const [editingMessage, setEditingMessage] =
    useState(null);

  /* =========================
     SUPPRESSION
  ========================= */

  const [deletingMessage, setDeletingMessage] =
    useState(null);

  /* =========================
     ENVOI MESSAGE
  ========================= */

  const sendMessage = async () => {

    if (
      !title.trim() ||
      !message.trim()
    ) return;

    try {

      const response =
        await axios.post(
          "https://konanshopping.com/api/messages",
         {
  title,
  content: message,
  target,
}
        );

      setMessages((prev) => [
        response.data,
        ...prev,
      ]);

      setMessagesCount(
        (prev) => prev + 1
      );

      setTitle("");

      setMessage("");

      setTarget("all");

      alert(
        "Message envoyé avec succès"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Erreur lors de l'envoi"
      );

    }

  };

  /* =========================
     RÉCUPÉRER LES MESSAGES
  ========================= */

  useEffect(() => {

    fetchMessages();

  }, []);

  const fetchMessages =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping.com/api/messages"
          );

        /*
          IMPORTANT :
          On récupère maintenant
          réellement les messages.
        */

        setMessages(
          res.data
        );

        setMessagesCount(
          res.data.length
        );

      } catch (err) {

        console.log(err);

      }

    };

  /* =========================
     RÉCUPÉRER LES CLIENTS
  ========================= */

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping.com/api/users"
          );

        setClientsCount(
          res.data.length
        );

      } catch (err) {

        console.log(err);

      }

    };

  /* =========================
     COMMENCER MODIFICATION
  ========================= */

  const startEdit = (msg) => {

    setEditingMessage(
      msg
    );

    setTitle(
      msg.title || ""
    );

    setMessage(
      msg.content ||
      msg.message ||
      ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  /* =========================
     ANNULER MODIFICATION
  ========================= */

  const cancelEdit = () => {

    setEditingMessage(
      null
    );

    setTitle("");

    setMessage("");

  };

  /* =========================
     ENREGISTRER MODIFICATION
  ========================= */

  const updateMessage = async () => {

    if (
      !editingMessage
    ) return;

    if (
      !title.trim() ||
      !message.trim()
    ) return;

    try {

      const response =
        await axios.put(

          `https://konanshopping.com/api/messages/${editingMessage._id}`,

          {
            title,
            content: message,
          }

        );

      setMessages((prev) =>

        prev.map((msg) =>

          msg._id ===
          editingMessage._id

            ? response.data

            : msg

        )

      );

      setEditingMessage(
        null
      );

      setTitle("");

      setMessage("");

      alert(
        "Message modifié avec succès"
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Erreur lors de la modification"
      );

    }

  };

  /* =========================
     SUPPRIMER MESSAGE
  ========================= */

  const deleteMessage = async () => {

    if (
      !deletingMessage
    ) return;

    try {

      await axios.delete(

        `https://konanshopping.com/api/messages/${deletingMessage._id}`

      );

      setMessages((prev) =>

        prev.filter(
          (msg) =>
            msg._id !==
            deletingMessage._id
        )

      );

      setMessagesCount(
        (prev) =>
          Math.max(
            0,
            prev - 1
          )
      );

      setDeletingMessage(
        null
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Erreur lors de la suppression"
      );

    }

  };

  const isReady =
    title.trim() &&
    message.trim();

  return (
    <div
      style={{
        minHeight:
          "100vh",

        background:
          "#f4f7fb",

        padding:
          "20px",

        color:
          "#111827",

        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#312e81 0%,#4f46e5 48%,#7c3aed 100%)",

          borderRadius:
            "28px",

          padding:
            "26px",

          color:
            "#fff",

          position:
            "relative",

          overflow:
            "hidden",

          boxShadow:
            "0 18px 45px rgba(79,70,229,.20)",
        }}
      >

        <div
          style={{
            position:
              "absolute",

            width:
              "180px",

            height:
              "180px",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,.07)",

            right:
              "-50px",

            top:
              "-70px",
          }}
        />

        <div
          style={{
            position:
              "absolute",

            width:
              "120px",

            height:
              "120px",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,.05)",

            right:
              "100px",

            bottom:
              "-80px",
          }}
        />

        <div
          style={{
            position:
              "relative",

            zIndex:
              2,

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "20px",

            flexWrap:
              "wrap",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "15px",
            }}
          >

            <div
              style={{
                width:
                  "58px",

                height:
                  "58px",

                borderRadius:
                  "18px",

                background:
                  "rgba(255,255,255,.15)",

                border:
                  "1px solid rgba(255,255,255,.20)",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backdropFilter:
                  "blur(10px)",
              }}
            >

              <FaBullhorn
                style={{
                  fontSize:
                    "24px",
                }}
              />

            </div>

            <div>

              <div
                style={{
                  fontSize:
                    "11px",

                  fontWeight:
                    "700",

                  letterSpacing:
                    "1.5px",

                  textTransform:
                    "uppercase",

                  opacity:
                    ".75",

                  marginBottom:
                    "4px",
                }}
              >
                Centre de communication
              </div>

              <h1
                style={{
                  margin:
                    0,

                  fontSize:
                    "25px",

                  fontWeight:
                    "850",

                  letterSpacing:
                    "-.5px",
                }}
              >
                Messages Clients
              </h1>

              <p
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "13px",

                  opacity:
                    ".88",
                }}
              >
                Communiquez efficacement avec votre clientèle.
              </p>

            </div>

          </div>

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "8px",

              background:
                "rgba(255,255,255,.12)",

              border:
                "1px solid rgba(255,255,255,.15)",

              padding:
                "9px 13px",

              borderRadius:
                "14px",

              fontSize:
                "12px",

              fontWeight:
                "700",
            }}
          >

            <FaCheckCircle />

            Communication active

          </div>

        </div>

      </div>


      {/* =====================================================
          KPI
      ===================================================== */}

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",

          gap:
            "14px",

          marginTop:
            "16px",
        }}
      >

        {/* CLIENTS */}

        <div
          style={{
            background:
              "#fff",

            border:
              "1px solid #e8ebf2",

            borderRadius:
              "22px",

            padding:
              "18px",

            boxShadow:
              "0 8px 25px rgba(15,23,42,.045)",
          }}
        >

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "flex-start",
            }}
          >

            <div
              style={{
                width:
                  "42px",

                height:
                  "42px",

                borderRadius:
                  "13px",

                background:
                  "#eef2ff",

                color:
                  "#4f46e5",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaUsers />

            </div>

            <span
              style={{
                fontSize:
                  "11px",

                color:
                  "#16a34a",

                background:
                  "#f0fdf4",

                padding:
                  "5px 8px",

                borderRadius:
                  "8px",

                fontWeight:
                  "700",
              }}
            >
              Audience
            </span>

          </div>

          <div
            style={{
              marginTop:
                "15px",

              fontSize:
                "27px",

              fontWeight:
                "850",

              letterSpacing:
                "-.5px",
            }}
          >
            {clientsCount}
          </div>

          <div
            style={{
              color:
                "#64748b",

              fontSize:
                "12px",

              marginTop:
                "2px",
            }}
          >
            Clients enregistrés
          </div>

        </div>


        {/* MESSAGES */}

        <div
          style={{
            background:
              "#fff",

            border:
              "1px solid #e8ebf2",

            borderRadius:
              "22px",

            padding:
              "18px",

            boxShadow:
              "0 8px 25px rgba(15,23,42,.045)",
          }}
        >

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "flex-start",
            }}
          >

            <div
              style={{
                width:
                  "42px",

                height:
                  "42px",

                borderRadius:
                  "13px",

                background:
                  "#f5f3ff",

                color:
                  "#7c3aed",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaBell />

            </div>

            <span
              style={{
                fontSize:
                  "11px",

                color:
                  "#7c3aed",

                background:
                  "#f5f3ff",

                padding:
                  "5px 8px",

                borderRadius:
                  "8px",

                fontWeight:
                  "700",
              }}
            >
              Historique
            </span>

          </div>

          <div
            style={{
              marginTop:
                "15px",

              fontSize:
                "27px",

              fontWeight:
                "850",

              letterSpacing:
                "-.5px",
            }}
          >
            {messagesCount}
          </div>

          <div
            style={{
              color:
                "#64748b",

              fontSize:
                "12px",

              marginTop:
                "2px",
            }}
          >
            Messages envoyés
          </div>

        </div>

      </div>


      {/* =====================================================
          COMPOSER
      ===================================================== */}

      <div
        style={{
          marginTop:
            "16px",

          background:
            "#fff",

          border:
            editingMessage
              ? "1px solid #c4b5fd"
              : "1px solid #e8ebf2",

          borderRadius:
            "26px",

          padding:
            "20px",

          boxShadow:
            "0 10px 30px rgba(15,23,42,.05)",
        }}
      >

        {/* FORM HEADER */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "10px",

            marginBottom:
              "18px",
          }}
        >

          <div>

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "9px",
              }}
            >

              <div
                style={{
                  width:
                    "34px",

                  height:
                    "34px",

                  borderRadius:
                    "10px",

                  background:
                    editingMessage
                      ? "#f5f3ff"
                      : "#eef2ff",

                  color:
                    "#4f46e5",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >

                {editingMessage
                  ? <FaEdit />
                  : <FaEnvelope />}

              </div>

              <h2
                style={{
                  margin:
                    0,

                  fontSize:
                    "18px",

                  fontWeight:
                    "850",
                }}
              >

                {editingMessage
                  ? "Modifier le message"
                  : "Nouvelle communication"}

              </h2>

            </div>

            <p
              style={{
                margin:
                  "7px 0 0 43px",

                color:
                  "#64748b",

                fontSize:
                  "12px",
              }}
            >

              {editingMessage
                ? "Modifiez le contenu de cette communication."
                : "Le message sera envoyé à tous vos clients."}

            </p>

          </div>

          {editingMessage && (

            <button
              onClick={
                cancelEdit
              }
              style={{
                width:
                  "38px",

                height:
                  "38px",

                border:
                  "none",

                borderRadius:
                  "11px",

                background:
                  "#f1f5f9",

                color:
                  "#64748b",

                cursor:
                  "pointer",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaTimes />

            </button>

          )}

        </div>


        {/* TITLE */}

        <label
          style={{
            display:
              "block",

            fontSize:
              "12px",

            fontWeight:
              "800",

            color:
              "#374151",

            marginBottom:
              "7px",
          }}
        >
          TITRE
        </label>

        <input
          value={
            title
          }

          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }

          placeholder={
            "Ex. Nouvelle collection disponible"
          }

          style={{
            width:
              "100%",

            height:
              "50px",

            boxSizing:
              "border-box",

            border:
              "1px solid #e2e8f0",

            borderRadius:
              "14px",

            padding:
              "0 15px",

            outline:
              "none",

            fontSize:
              "14px",

            fontWeight:
              "600",

            background:
              "#f8fafc",

            color:
              "#111827",
          }}
        />


        {/* MESSAGE */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginTop:
              "15px",

            marginBottom:
              "7px",
          }}
        >

          <label
            style={{
              fontSize:
                "12px",

              fontWeight:
                "800",

              color:
                "#374151",
            }}
          >
            MESSAGE
          </label>

          <span
            style={{
              fontSize:
                "11px",

              color:
                message.length > 900
                  ? "#dc2626"
                  : "#94a3b8",

              fontWeight:
                "600",
            }}
          >
            {message.length} caractères
          </span>

        </div>

        <textarea
          value={
            message
          }

          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }

          placeholder={
            "Écrivez votre message ici..."
          }

          style={{
            width:
              "100%",

            height:
              "155px",

            boxSizing:
              "border-box",

            border:
              "1px solid #e2e8f0",

            borderRadius:
              "14px",

            padding:
              "15px",

            resize:
              "vertical",

            minHeight:
              "120px",

            outline:
              "none",

            fontSize:
              "14px",

            fontWeight:
              "500",

            background:
              "#f8fafc",

            color:
              "#111827",

            lineHeight:
              "1.65",
          }}
        />


        {/* =====================================================
    DESTINATAIRES
===================================================== */}

<div
  style={{
    marginTop: "16px",
  }}
>

  <div
    style={{
      fontSize: "12px",
      fontWeight: "800",
      color: "#374151",
      marginBottom: "9px",
    }}
  >
    DESTINATAIRES
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
      gap: "10px",
    }}
  >

    {/* TOUS LES CLIENTS */}

    <button
      type="button"
      onClick={() =>
        setTarget("all")
      }
      style={{
        border:
          target === "all"
            ? "2px solid #4f46e5"
            : "1px solid #e2e8f0",

        background:
          target === "all"
            ? "#eef2ff"
            : "#f8fafc",

        borderRadius: "15px",

        padding: "14px",

        textAlign: "left",

        cursor: "pointer",

        transition:
          "all .2s ease",

        color: "#111827",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "11px",

            background:
              target === "all"
                ? "#4f46e5"
                : "#e2e8f0",

            color:
              target === "all"
                ? "#fff"
                : "#64748b",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,
          }}
        >

          <FaUsers />

        </div>

        <div
          style={{
            minWidth: 0,
          }}
        >

          <div
            style={{
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            Tous les clients
          </div>

          <div
            style={{
              marginTop: "3px",
              fontSize: "10px",
              color: "#64748b",
              lineHeight: "1.4",
            }}
          >
            Envoyer à toute votre clientèle
          </div>

        </div>

        {target === "all" && (

          <FaCheckCircle
            style={{
              marginLeft: "auto",
              color: "#4f46e5",
              flexShrink: 0,
            }}
          />

        )}

      </div>

    </button>


    {/* NOUVEAUX CLIENTS */}

    <button
      type="button"
      onClick={() =>
        setTarget("new")
      }
      style={{
        border:
          target === "new"
            ? "2px solid #7c3aed"
            : "1px solid #e2e8f0",

        background:
          target === "new"
            ? "#f5f3ff"
            : "#f8fafc",

        borderRadius: "15px",

        padding: "14px",

        textAlign: "left",

        cursor: "pointer",

        transition:
          "all .2s ease",

        color: "#111827",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "11px",

            background:
              target === "new"
                ? "#7c3aed"
                : "#e2e8f0",

            color:
              target === "new"
                ? "#fff"
                : "#64748b",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,
          }}
        >

          <FaBell />

        </div>

        <div
          style={{
            minWidth: 0,
          }}
        >

          <div
            style={{
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            Nouveaux clients
          </div>

          <div
            style={{
              marginTop: "3px",
              fontSize: "10px",
              color: "#64748b",
              lineHeight: "1.4",
            }}
          >
            Cibler les nouveaux inscrits
          </div>

        </div>

        {target === "new" && (

          <FaCheckCircle
            style={{
              marginLeft: "auto",
              color: "#7c3aed",
              flexShrink: 0,
            }}
          />

        )}

      </div>

    </button>

  </div>


  {/* INDICATION */}

  <div
    style={{
      marginTop: "9px",
      padding: "9px 11px",
      borderRadius: "10px",
      background:
        target === "all"
          ? "#f8fafc"
          : "#faf5ff",
      color:
        target === "all"
          ? "#64748b"
          : "#7c3aed",
      fontSize: "10px",
      lineHeight: "1.5",
      fontWeight: "600",
    }}
  >

    {target === "all"
      ? "👥 Ce message sera destiné à tous les clients."
      : "🆕 Ce message sera identifié comme une communication destinée aux nouveaux clients."}

  </div>

</div>

        {/* BUTTONS */}

        <div
          style={{
            display:
              "flex",

            gap:
              "10px",

            marginTop:
              "14px",
          }}
        >

          {editingMessage && (

            <button
              onClick={
                cancelEdit
              }
              style={{
                flex:
                  "0 0 48px",

                height:
                  "52px",

                border:
                  "none",

                borderRadius:
                  "15px",

                background:
                  "#f1f5f9",

                color:
                  "#64748b",

                cursor:
                  "pointer",

                display:
                  "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",
              }}
            >

              <FaTimes />

            </button>

          )}

          <button
            onClick={
              editingMessage
                ? updateMessage
                : sendMessage
            }

            disabled={
              !isReady
            }

            style={{
              flex:
                1,

              height:
                "52px",

              border:
                "none",

              borderRadius:
                "15px",

              background:
                isReady
                  ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                  : "#e2e8f0",

              color:
                isReady
                  ? "#fff"
                  : "#94a3b8",

              fontWeight:
                "800",

              fontSize:
                "14px",

              cursor:
                isReady
                  ? "pointer"
                  : "not-allowed",

              display:
                "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              gap:
                "9px",

              boxShadow:
                isReady
                  ? "0 10px 25px rgba(79,70,229,.22)"
                  : "none",
            }}
          >

            {editingMessage
              ? <FaSave />
              : <FaPaperPlane />}

           {editingMessage
  ? "Enregistrer les modifications"
  : target === "new"
    ? "Envoyer aux nouveaux clients"
    : "Envoyer à tous les clients"}

            <FaArrowRight
              style={{
                fontSize:
                  "12px",
              }}
            />

          </button>

        </div>

      </div>


      {/* =====================================================
          PREVIEW
      ===================================================== */}

      {(title || message) && (

        <div
          style={{
            marginTop:
              "16px",

            background:
              "#fff",

            border:
              "1px solid #e8ebf2",

            borderRadius:
              "24px",

            padding:
              "20px",

            boxShadow:
              "0 8px 25px rgba(15,23,42,.04)",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "8px",

              marginBottom:
                "14px",
            }}
          >

            <FaClock
              style={{
                color:
                  "#64748b",

                fontSize:
                  "13px",
              }}
            />

            <span
              style={{
                fontSize:
                  "11px",

                fontWeight:
                  "800",

                color:
                  "#64748b",

                textTransform:
                  "uppercase",

                letterSpacing:
                  ".7px",
              }}
            >
              Aperçu
            </span>

          </div>

          <div
            style={{
              border:
                "1px solid #edf0f5",

              borderRadius:
                "18px",

              padding:
                "16px",

              background:
                "#fafbff",
            }}
          >

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "9px",

                marginBottom:
                  "10px",
              }}
            >

              <div
                style={{
                  width:
                    "34px",

                  height:
                    "34px",

                  borderRadius:
                    "11px",

                  background:
                    "linear-gradient(135deg,#4f46e5,#7c3aed)",

                  color:
                    "#fff",

                  display:
                    "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  fontSize:
                    "13px",
                }}
              >

                <FaBell />

              </div>

              <div>

                <div
                  style={{
                    fontSize:
                      "13px",

                    fontWeight:
                      "800",
                  }}
                >
                  KONAN SHOPPING
                </div>

                <div
                  style={{
                    fontSize:
                      "10px",

                    color:
                      "#94a3b8",
                  }}
                >
                  Communication client
                </div>

              </div>

            </div>

            <h3
              style={{
                margin:
                  "0 0 7px",

                fontSize:
                  "15px",

                fontWeight:
                  "800",

                color:
                  "#111827",
              }}
            >
              {title ||
                "Titre du message"}
            </h3>

            <p
              style={{
                margin:
                  0,

                color:
                  message
                    ? "#475569"
                    : "#cbd5e1",

                fontSize:
                  "13px",

                lineHeight:
                  "1.65",

                whiteSpace:
                  "pre-wrap",
              }}
            >
              {message ||
                "Votre message apparaîtra ici..."}
            </p>

          </div>

        </div>

      )}

      {/* =====================================================
          HISTORY
      ===================================================== */}

      <div
        style={{
          marginTop:
            "18px",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            marginBottom:
              "12px",

            gap:
              "10px",
          }}
        >

          <div>

            <h3
              style={{
                margin:
                  0,

                fontSize:
                  "18px",

                fontWeight:
                  "850",
              }}
            >
              Messages envoyés
            </h3>

            <p
              style={{
                margin:
                  "4px 0 0",

                color:
                  "#64748b",

                fontSize:
                  "12px",
              }}
            >
              Historique de vos communications
            </p>

          </div>

          <div
            style={{
              background:
                "#eef2ff",

              color:
                "#4f46e5",

              borderRadius:
                "10px",

              padding:
                "7px 10px",

              fontSize:
                "11px",

              fontWeight:
                "800",
            }}
          >
            {messages.length}
          </div>

        </div>


        {/* EMPTY STATE */}

        {messages.length === 0 && (

          <div
            style={{
              background:
                "#fff",

              border:
                "1px solid #e8ebf2",

              borderRadius:
                "22px",

              padding:
                "35px 20px",

              textAlign:
                "center",

              boxShadow:
                "0 8px 25px rgba(15,23,42,.04)",
            }}
          >

            <div
              style={{
                width:
                  "60px",

                height:
                  "60px",

                borderRadius:
                  "18px",

                background:
                  "#eef2ff",

                color:
                  "#4f46e5",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                margin:
                  "0 auto 12px",

                fontSize:
                  "22px",
              }}
            >

              <FaEnvelope />

            </div>

            <h3
              style={{
                margin:
                  "0 0 6px",

                fontSize:
                  "15px",
              }}
            >
              Aucun message envoyé
            </h3>

            <p
              style={{
                margin:
                  0,

                color:
                  "#94a3b8",

                fontSize:
                  "12px",
              }}
            >
              Vos communications apparaîtront ici.
            </p>

          </div>

        )}


        {/* MESSAGE LIST */}

        {messages.map(
          (msg, index) => (

            <div
              key={
                msg._id ||
                msg.id ||
                index
              }

              style={{
                background:
                  "#fff",

                border:
                  "1px solid #e8ebf2",

                borderRadius:
                  "20px",

                padding:
                  "16px",

                marginBottom:
                  "10px",

                boxShadow:
                  "0 6px 20px rgba(15,23,42,.035)",

                transition:
                  "all .2s ease",
              }}

              onMouseEnter={(e) => {

                e.currentTarget.style.transform =
                  "translateY(-1px)";

                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(15,23,42,.07)";

              }}

              onMouseLeave={(e) => {

                e.currentTarget.style.transform =
                  "translateY(0)";

                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(15,23,42,.035)";

              }}
            >

              {/* TOP */}

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "flex-start",

                  justifyContent:
                    "space-between",

                  gap:
                    "12px",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "10px",

                    minWidth:
                      0,
                  }}
                >

                  <div
                    style={{
                      width:
                        "40px",

                      height:
                        "40px",

                      flexShrink:
                        0,

                      borderRadius:
                        "12px",

                      background:
                        "#eef2ff",

                      color:
                        "#4f46e5",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >

                    <FaEnvelope />

                  </div>

                  <div
                    style={{
                      minWidth:
                        0,
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "14px",

                        fontWeight:
                          "800",

                        color:
                          "#111827",

                        overflow:
                          "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {msg.title}
                    </div>

                    <div
                      style={{
                        marginTop:
                          "3px",

                        fontSize:
                          "10px",

                        color:
                          "#94a3b8",
                      }}
                    >
                      Communication client
                    </div>

                  </div>

                </div>


                {/* STATUS */}

                <span
                  style={{
                    flexShrink:
                      0,

                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap:
                      "5px",

                    background:
                      "#f0fdf4",

                    color:
                      "#16a34a",

                    padding:
                      "5px 8px",

                    borderRadius:
                      "8px",

                    fontSize:
                      "10px",

                    fontWeight:
                      "800",
                  }}
                >

                  <FaCheckCircle />

                  Envoyé

                </span>

              </div>


              {/* CONTENT */}

              <div
                style={{
                  marginTop:
                    "13px",

                  paddingTop:
                    "13px",

                  borderTop:
                    "1px solid #f1f5f9",
                }}
              >

                <p
                  style={{
                    margin:
                      0,

                    color:
                      "#475569",

                    fontSize:
                      "13px",

                    lineHeight:
                      "1.65",

                    whiteSpace:
                      "pre-wrap",
                  }}
                >
                  {msg.content ||
                    msg.message}
                </p>

              </div>


              {/* FOOTER */}

              <div
                style={{
                  marginTop:
                    "14px",

                  paddingTop:
                    "12px",

                  borderTop:
                    "1px solid #f1f5f9",

                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  gap:
                    "10px",

                  flexWrap:
                    "wrap",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "6px",

                    color:
                      "#94a3b8",

                    fontSize:
                      "10px",
                  }}
                >

                  <FaClock />

                  {msg.createdAt
                    ? new Date(
                        msg.createdAt
                      ).toLocaleString(
                        "fr-FR",
                        {
                          day:
                            "2-digit",

                          month:
                            "short",

                          year:
                            "numeric",

                          hour:
                            "2-digit",

                          minute:
                            "2-digit",
                        }
                      )
                    : "Date inconnue"}

                </div>


                {/* ACTIONS */}

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "7px",
                  }}
                >

                  {/* MODIFIER */}

                  <button
                    onClick={() =>
                      startEdit(msg)
                    }

                    style={{
                      height:
                        "34px",

                      padding:
                        "0 11px",

                      border:
                        "1px solid #e0e7ff",

                      borderRadius:
                        "10px",

                      background:
                        "#f8faff",

                      color:
                        "#4f46e5",

                      cursor:
                        "pointer",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      gap:
                        "6px",

                      fontSize:
                        "11px",

                      fontWeight:
                        "800",
                    }}
                  >

                    <FaEdit />

                    Modifier

                  </button>


                  {/* SUPPRIMER */}

                  <button
                    onClick={() =>
                      setDeletingMessage(
                        msg
                      )
                    }

                    style={{
                      width:
                        "34px",

                      height:
                        "34px",

                      border:
                        "1px solid #fee2e2",

                      borderRadius:
                        "10px",

                      background:
                        "#fffafa",

                      color:
                        "#dc2626",

                      cursor:
                        "pointer",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >

                    <FaTrash />

                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deletingMessage && (

        <div
          style={{
            position:
              "fixed",

            inset:
              0,

            background:
              "rgba(15,23,42,.60)",

            backdropFilter:
              "blur(6px)",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding:
              "20px",

            zIndex:
              99999,
          }}
        >

          <div
            style={{
              width:
                "100%",

              maxWidth:
                "420px",

              background:
                "#fff",

              borderRadius:
                "24px",

              padding:
                "22px",

              boxShadow:
                "0 25px 70px rgba(0,0,0,.25)",
            }}
          >

            {/* ICON */}

            <div
              style={{
                width:
                  "52px",

                height:
                  "52px",

                borderRadius:
                  "16px",

                background:
                  "#fef2f2",

                color:
                  "#dc2626",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                marginBottom:
                  "15px",

                fontSize:
                  "20px",
              }}
            >

              <FaExclamationTriangle />

            </div>


            <h2
              style={{
                margin:
                  "0 0 7px",

                fontSize:
                  "19px",

                fontWeight:
                  "850",

                color:
                  "#111827",
              }}
            >
              Supprimer ce message ?
            </h2>

            <p
              style={{
                margin:
                  "0",

                color:
                  "#64748b",

                fontSize:
                  "13px",

                lineHeight:
                  "1.6",
              }}
            >
              Cette action supprimera définitivement
              ce message de votre historique.
            </p>


            {/* MESSAGE PREVIEW */}

            <div
              style={{
                marginTop:
                  "15px",

                padding:
                  "12px",

                background:
                  "#f8fafc",

                border:
                  "1px solid #edf0f5",

                borderRadius:
                  "12px",
              }}
            >

              <strong
                style={{
                  display:
                    "block",

                  fontSize:
                    "13px",

                  color:
                    "#111827",

                  marginBottom:
                    "4px",
                }}
              >
                {deletingMessage.title}
              </strong>

              <span
                style={{
                  display:
                    "block",

                  color:
                    "#64748b",

                  fontSize:
                    "11px",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {deletingMessage.content ||
                  deletingMessage.message}
              </span>

            </div>


            {/* MODAL ACTIONS */}

            <div
              style={{
                display:
                  "flex",

                gap:
                  "10px",

                marginTop:
                  "18px",
              }}
            >

              <button
                onClick={() =>
                  setDeletingMessage(
                    null
                  )
                }

                style={{
                  flex:
                    1,

                  height:
                    "46px",

                  border:
                    "none",

                  borderRadius:
                    "13px",

                  background:
                    "#f1f5f9",

                  color:
                    "#475569",

                  fontWeight:
                    "800",

                  cursor:
                    "pointer",
                }}
              >
                Annuler
              </button>


              <button
                onClick={
                  deleteMessage
                }

                style={{
                  flex:
                    1,

                  height:
                    "46px",

                  border:
                    "none",

                  borderRadius:
                    "13px",

                  background:
                    "#dc2626",

                  color:
                    "#fff",

                  fontWeight:
                    "800",

                  cursor:
                    "pointer",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap:
                    "7px",
                }}
              >

                <FaTrash />

                Supprimer

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminMessages;