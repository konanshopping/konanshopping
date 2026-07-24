import { useMemo, useState } from "react";
import {
  FaSearch,
  FaUserShield,
  FaStore,
  FaCheckCircle,
  FaCircle,
  FaCommentDots
} from "react-icons/fa";

function Members({

  members,

  currentUser,

  onOpenProfile,

  onMessage

}) {

  const [search, setSearch] = useState("");

  const safeMembers = Array.isArray(members)
    ? members
    : [];

  const filteredMembers = useMemo(() => {

    return safeMembers.filter((member) =>
      (member.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [safeMembers, search]);

  return (

    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#F6F7FB",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* Recherche */}

      <div style={{ padding: 16 }}>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            borderRadius: 20,
            padding: "0 16px",
            height: 52,
            boxShadow: "0 4px 15px rgba(91,46,145,.08)"
          }}
        >

          <FaSearch color="#8B5CF6" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Rechercher un membre..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15
            }}
          />

        </div>

      </div>

      {filteredMembers.length === 0 && (

        <div
          style={{
            textAlign: "center",
            color: "#6B7280",
            padding: 40,
            fontWeight: 600
          }}
        >
          Aucun membre trouvé.
        </div>

      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0 12px 20px"
        }}
      >

        {filteredMembers.map((member) => (

          <div
            key={member._id || member.id || member.name}
            onClick={() => onOpenProfile?.(member)}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 5px 15px rgba(91,46,145,.08)",
              cursor: "pointer"
            }}
          >

            <div
              style={{
                position: "relative"
              }}
            >

              <img
                src={member.avatar || "/avatar.png"}
                alt={member.name || "Membre"}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />

              <FaCircle
                style={{
                  position: "absolute",
                  right: 2,
                  bottom: 2,
                  color: member.online ? "#22C55E" : "#D1D5DB",
                  background: "#fff",
                  borderRadius: "50%",
                  fontSize: 12
                }}
              />

            </div>

            <div
              style={{
                flex: 1
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap"
                }}
              >

                <strong>
                  {member.name || "Utilisateur"}
                </strong>

                {member.role === "admin" && (
                  <FaUserShield color="#8B5CF6" />
                )}

                {member.role === "seller" && (
                  <FaStore color="#F97316" />
                )}

                {member.verified && (
                  <FaCheckCircle color="#22C55E" />
                )}

              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginTop: 4
                }}
              >
                {member.online ? "En ligne" : "Hors ligne"}
              </div>

            </div>

            {member._id !== currentUser?._id && (

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  onMessage?.(member);

                }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  border: "none",
                  background: "#5B2E91",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >

                <FaCommentDots />

              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default Members;