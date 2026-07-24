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

  members = [],

  currentUser,

  onOpenProfile,

  onMessage

}) {

  const [search, setSearch] =
    useState("");

  const filteredMembers =
    useMemo(() => {

      return members.filter((member) =>
        member.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    }, [members, search]);

  return (

    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#F4F7FB",
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* Recherche */}

      <div
        style={{
          padding: "16px"
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            borderRadius: 18,
            padding: "0 14px",
            height: 52,
            boxShadow:
              "0 4px 12px rgba(0,0,0,.06)"
          }}
        >

          <FaSearch
            color="#9CA3AF"
          />

          <input

            value={search}

            onChange={(e)=>
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

      {/* Liste */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0 12px 20px"
        }}
      >

        {filteredMembers.map((member)=>(

          <div

            key={member._id}

            onClick={()=>
              onOpenProfile(member)
            }

            style={{

              background:"#fff",

              borderRadius:18,

              padding:"14px",

              display:"flex",

              alignItems:"center",

              gap:12,

              boxShadow:
                "0 6px 15px rgba(0,0,0,.05)",

              cursor:"pointer"

            }}

          >

            {/* Avatar */}

            <div
              style={{
                position:"relative"
              }}
            >

              <img

                src={
                  member.avatar ||
                  "/avatar.png"
                }

                alt={member.name}

                style={{

                  width:58,

                  height:58,

                  borderRadius:"50%",

                  objectFit:"cover"

                }}

              />

              <FaCircle

                style={{

                  position:"absolute",

                  right:2,

                  bottom:2,

                  color:
                    member.online
                      ? "#22C55E"
                      : "#9CA3AF",

                  background:"#fff",

                  borderRadius:"50%",

                  fontSize:12

                }}

              />

            </div>

            {/* Infos */}

            <div
              style={{
                flex:1,
                overflow:"hidden"
              }}
            >

              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:6,
                  flexWrap:"wrap"
                }}
              >

                <span
                  style={{
                    fontWeight:700,
                    color:"#111827",
                    fontSize:15
                  }}
                >
                  {member.name}
                </span>

                {member.role==="admin" &&

                  <FaUserShield
                    color="#2563EB"
                  />

                }

                {member.role==="seller" &&

                  <FaStore
                    color="#10B981"
                  />

                }

                {member.verified &&

                  <FaCheckCircle
                    color="#3B82F6"
                  />

                }

              </div>

              <div
                style={{
                  marginTop:4,
                  color:"#6B7280",
                  fontSize:13
                }}
              >

                {member.online
                  ? "En ligne"
                  : "Hors ligne"}

              </div>

            </div>

            {/* Bouton message */}

            {member._id !==
              currentUser?._id && (

              <button

                onClick={(e)=>{

                  e.stopPropagation();

                  onMessage(member);

                }}

                style={{

                  width:46,

                  height:46,

                  border:"none",

                  borderRadius:"50%",

                  background:"#2563EB",

                  color:"#fff",

                  display:"flex",

                  justifyContent:"center",

                  alignItems:"center",

                  cursor:"pointer",

                  fontSize:18

                }}

              >

                <FaCommentDots/>

              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default Members;