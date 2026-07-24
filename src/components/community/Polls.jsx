import { useMemo, useState } from "react";

import {
  FaSearch,
  FaPoll,
  FaVoteYea,
  FaUsers,
  FaCalendarAlt,
  FaUserCircle,
  FaLock,
  FaCheckCircle
} from "react-icons/fa";

function Polls({

  polls = [],

  onVote

}) {

  const [search, setSearch] =
    useState("");

  const filteredPolls =
    useMemo(() => {

      return polls.filter((poll) =>

        poll.question
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    }, [polls, search]);

  return (

    <div
      style={{
        background:"#F4F7FB",
        minHeight:"100%"
      }}
    >

      {/* Recherche */}

      <div
        style={{
          padding:16
        }}
      >

        <div
          style={{
            height:52,
            background:"#fff",
            borderRadius:16,
            display:"flex",
            alignItems:"center",
            gap:10,
            padding:"0 14px",
            boxShadow:"0 4px 12px rgba(0,0,0,.05)"
          }}
        >

          <FaSearch color="#9CA3AF"/>

          <input

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Rechercher un sondage..."

            style={{
              flex:1,
              border:"none",
              outline:"none",
              background:"transparent",
              fontSize:15
            }}

          />

        </div>

      </div>

      {/* Liste */}

      <div
        style={{
          padding:"0 16px 20px",
          display:"flex",
          flexDirection:"column",
          gap:16
        }}
      >

        {filteredPolls.map((poll)=>(

          <div

            key={poll._id}

            style={{

              background:"#fff",

              borderRadius:20,

              padding:18,

              boxShadow:"0 8px 20px rgba(0,0,0,.06)"

            }}

          >

            <div
              style={{
                display:"flex",
                alignItems:"center",
                gap:8,
                marginBottom:10
              }}
            >

              <FaPoll color="#2563EB"/>

              <span
                style={{
                  fontWeight:800,
                  fontSize:16,
                  color:"#111827"
                }}
              >
                {poll.question}
              </span>

            </div>

            <div
              style={{
                display:"flex",
                flexWrap:"wrap",
                gap:14,
                marginBottom:18,
                fontSize:12,
                color:"#6B7280"
              }}
            >

              <span
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:5
                }}
              >
                <FaUserCircle/>
                {poll.author}
              </span>

              <span
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:5
                }}
              >
                <FaCalendarAlt/>
                {poll.date}
              </span>

              <span
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:5
                }}
              >
                <FaUsers/>
                {poll.totalVotes} votes
              </span>

              {poll.closed && (

                <span
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:5,
                    color:"#EF4444"
                  }}
                >
                  <FaLock/>
                  Fermé
                </span>

              )}

            </div>

            {poll.options.map((option,index)=>{

              const percent =
                poll.totalVotes === 0

                  ? 0

                  :

                  Math.round(

                    option.votes
                    *100
                    /poll.totalVotes

                  );

              return(

                <button

                  key={index}

                  disabled={poll.closed}

                  onClick={()=>
                    onVote(
                      poll._id,
                      index
                    )
                  }

                  style={{

                    width:"100%",

                    marginBottom:12,

                    border:"none",

                    borderRadius:16,

                    overflow:"hidden",

                    cursor:
                      poll.closed
                        ? "default"
                        : "pointer",

                    background:"#F3F4F6",

                    padding:0

                  }}

                >

                  <div
                    style={{
                      width:`${percent}%`,
                      background:"#2563EB",
                      color:"#fff",
                      padding:"14px",
                      transition:".3s",
                      minWidth:70,
                      textAlign:"left",
                      display:"flex",
                      justifyContent:"space-between",
                      alignItems:"center"
                    }}
                  >

                    <span>

                      {option.label}

                    </span>

                    <span>

                      {percent}%

                    </span>

                  </div>

                </button>

              );

            })}

            <div
              style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                marginTop:8
              }}
            >

              <span
                style={{
                  fontSize:13,
                  color:"#6B7280"
                }}
              >

                <FaVoteYea/>

                {" "}

                Votez en un clic

              </span>

              {poll.voted && (

                <span
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:5,
                    color:"#22C55E",
                    fontWeight:700,
                    fontSize:13
                  }}
                >

                  <FaCheckCircle/>

                  Vote enregistré

                </span>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Polls;