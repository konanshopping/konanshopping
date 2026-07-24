import {
  FaComments,
  FaUsers,
  FaImage,
  FaFileAlt,
  FaPoll
} from "react-icons/fa";

const tabs = [
  {
    id: "discussion",
    title: "Discussion",
    icon: <FaComments />
  },
  {
    id: "members",
    title: "Membres",
    icon: <FaUsers />
  },
  {
    id: "media",
    title: "Médias",
    icon: <FaImage />
  },
  {
    id: "files",
    title: "Fichiers",
    icon: <FaFileAlt />
  },
  {
    id: "polls",
    title: "Sondages",
    icon: <FaPoll />
  }
];

function CommunityTabs({
  activeTab,
  setActiveTab
}) {
  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        borderBottom: "1px solid #E5E7EB"
      }}
    >
      <div
        style={{
          display: "flex",
          minWidth: "max-content"
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              width: "20%",
              minWidth: 82,
              maxWidth: 120,
              padding: "14px 8px",
              border: "none",
              outline: "none",
              cursor: "pointer",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color:
                activeTab === tab.id
                  ? "#2563EB"
                  : "#6B7280",
              borderBottom:
                activeTab === tab.id
                  ? "3px solid #2563EB"
                  : "3px solid transparent",
              transition: "0.25s"
            }}
          >
            <div
              style={{
                fontSize: 21,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {tab.icon}
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap"
              }}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CommunityTabs;