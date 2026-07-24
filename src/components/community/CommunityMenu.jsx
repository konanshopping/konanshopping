import {
  FaUsers,
  FaImages,
  FaFolderOpen,
  FaPoll,
  FaBullhorn,
  FaBell,
  FaUserCircle,
  FaCog,
  FaShieldAlt,
  FaTimes
} from "react-icons/fa";

const menuItems = [
  {
    icon: <FaUsers />,
    title: "Membres",
    id: "members"
  },
  {
    icon: <FaImages />,
    title: "Médias",
    id: "media"
  },
  {
    icon: <FaFolderOpen />,
    title: "Fichiers",
    id: "files"
  },
  {
    icon: <FaPoll />,
    title: "Sondages",
    id: "polls"
  },
  {
    icon: <FaBullhorn />,
    title: "Annonces",
    id: "announcements"
  },
  {
    icon: <FaBell />,
    title: "Notifications",
    id: "notifications"
  },
  {
    icon: <FaUserCircle />,
    title: "Mon profil",
    id: "profile"
  },
  {
    icon: <FaCog />,
    title: "Paramètres",
    id: "settings"
  },
  {
    icon: <FaShieldAlt />,
    title: "Règles",
    id: "rules"
  }
];

function CommunityMenu({
  open,
  onClose,
  onSelect
}) {

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "88%",
          maxWidth: 340,
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 30px rgba(0,0,0,.18)"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px",
            borderBottom: "1px solid #E5E7EB"
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              color: "#111827"
            }}
          >
            Menu
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 20,
              color: "#6B7280"
            }}
          >
            <FaTimes />
          </button>

        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto"
          }}
        >

          {menuItems.map((item) => (

            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px",
                cursor: "pointer",
                fontSize: 16,
                color: "#111827",
                borderBottom: "1px solid #F3F4F6"
              }}
            >

              <span
                style={{
                  fontSize: 20,
                  color: "#2563EB",
                  width: 24,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  fontWeight: 600
                }}
              >
                {item.title}
              </span>

            </button>

          ))}

        </div>

      </div>

    </div>
  );

}

export default CommunityMenu;