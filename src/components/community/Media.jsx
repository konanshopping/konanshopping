import { useState, useMemo } from "react";

import {
  FaSearch,
  FaImage,
  FaVideo,
  FaHeart,
  FaCommentDots,
  FaTimes,
  FaPlayCircle
} from "react-icons/fa";

function Media({

  media = []

}) {

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const filteredMedia =
    useMemo(() => {

      return media.filter((item) =>

        item.user
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    }, [media, search]);

  return (

    <div
      style={{
        minHeight: "100%",
        background: "#F4F7FB"
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
            height: 50,
            background: "#fff",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 14px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,.05)"
          }}
        >

          <FaSearch color="#9CA3AF"/>

          <input

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Rechercher..."

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

      {/* Grille */}

      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(150px,1fr))",
          gap:"12px",
          padding:"0 16px 20px"
        }}
      >

        {filteredMedia.map((item)=>(

          <div

            key={item._id}

            onClick={()=>
              setSelected(item)
            }

            style={{

              background:"#fff",

              borderRadius:18,

              overflow:"hidden",

              cursor:"pointer",

              boxShadow:
                "0 6px 16px rgba(0,0,0,.06)"

            }}

          >

            <div
              style={{
                position:"relative"
              }}
            >

              {item.type==="video" ? (

                <>

                  <video

                    src={item.url}

                    style={{
                      width:"100%",
                      height:170,
                      objectFit:"cover"
                    }}

                  />

                  <FaPlayCircle

                    style={{

                      position:"absolute",

                      top:"50%",

                      left:"50%",

                      transform:
                        "translate(-50%,-50%)",

                      fontSize:45,

                      color:"#fff"

                    }}

                  />

                </>

              ) : (

                <img

                  src={item.url}

                  alt="media"

                  style={{

                    width:"100%",

                    height:170,

                    objectFit:"cover"

                  }}

                />

              )}

            </div>

            <div
              style={{
                padding:"12px"
              }}
            >

              <div
                style={{
                  fontWeight:700,
                  color:"#111827",
                  fontSize:14
                }}
              >

                {item.user}

              </div>

              <div
                style={{
                  marginTop:8,
                  display:"flex",
                  justifyContent:"space-between",
                  color:"#6B7280",
                  fontSize:13
                }}
              >

                <span
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:5
                  }}
                >

                  <FaHeart/>

                  {item.likes}

                </span>

                <span
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:5
                  }}
                >

                  <FaCommentDots/>

                  {item.comments}

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Aperçu */}

      {selected && (

        <div

          onClick={()=>
            setSelected(null)
          }

          style={{

            position:"fixed",

            inset:0,

            background:"rgba(0,0,0,.9)",

            display:"flex",

            justifyContent:"center",

            alignItems:"center",

            zIndex:9999,

            padding:20

          }}

        >

          <button

            style={{

              position:"absolute",

              top:20,

              right:20,

              border:"none",

              background:"transparent",

              color:"#fff",

              fontSize:24

            }}

          >

            <FaTimes/>

          </button>

          {selected.type==="video" ? (

            <video

              controls

              autoPlay

              style={{

                maxWidth:"100%",

                maxHeight:"90%",

                borderRadius:20

              }}

            >

              <source src={selected.url}/>

            </video>

          ) : (

            <img

              src={selected.url}

              alt="preview"

              style={{

                maxWidth:"100%",

                maxHeight:"90%",

                borderRadius:20

              }}

            />

          )}

        </div>

      )}

    </div>

  );

}

export default Media;