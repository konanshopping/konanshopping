import { useMemo, useState } from "react";

import {
  FaSearch,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFileAlt,
  FaDownload,
  FaEye,
  FaUserCircle,
  FaCalendarAlt,
  FaWeightHanging
} from "react-icons/fa";

function Files({

  files,

  onPreview,

  onDownload

}) {

  const safeFiles = Array.isArray(files)
    ? files
    : [];

  const [search, setSearch] =
    useState("");

  const filteredFiles =
    useMemo(() => {

      return safeFiles.filter(file =>

        file?.name
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    }, [safeFiles, search]);

  const getIcon = (type) => {

    switch (type) {

      case "pdf":
        return <FaFilePdf color="#EF4444" size={28} />;

      case "doc":
      case "docx":
        return <FaFileWord color="#2563EB" size={28} />;

      case "xls":
      case "xlsx":
        return <FaFileExcel color="#16A34A" size={28} />;

      case "zip":
      case "rar":
        return <FaFileArchive color="#F59E0B" size={28} />;

      default:
        return <FaFileAlt color="#6B7280" size={28} />;
    }

  };

  return (

    <div
      style={{
        background: "#F4F7FB",
        minHeight: "100%"
      }}
    >

      {/* Recherche */}

      <div style={{ padding: 16 }}>

        <div
          style={{
            height: 52,
            background: "#fff",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,.05)"
          }}
        >

          <FaSearch color="#9CA3AF" />

          <input

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Rechercher un document..."

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
          gap:14
        }}
      >

        {filteredFiles.map(file=>(

          <div

           key={file._id || file.id || file.name}

            style={{

              background:"#fff",

              borderRadius:18,

              padding:16,

              boxShadow:"0 6px 16px rgba(0,0,0,.06)"

            }}

          >

            <div
              style={{
                display:"flex",
                gap:14,
                alignItems:"center"
              }}
            >

              {getIcon(file.type)}

              <div
                style={{
                  flex:1,
                  overflow:"hidden"
                }}
              >

                <div
                  style={{
                    fontWeight:700,
                    fontSize:15,
                    color:"#111827",
                    overflow:"hidden",
                    whiteSpace:"nowrap",
                    textOverflow:"ellipsis"
                  }}
                >
                  {file.name}
                </div>

                <div
                  style={{
                    marginTop:8,
                    display:"flex",
                    flexWrap:"wrap",
                    gap:14,
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
                    {file.user}
                  </span>

                  <span
                    style={{
                      display:"flex",
                      alignItems:"center",
                      gap:5
                    }}
                  >
                    <FaCalendarAlt/>
                    {file.date}
                  </span>

                  <span
                    style={{
                      display:"flex",
                      alignItems:"center",
                      gap:5
                    }}
                  >
                    <FaWeightHanging/>
                    {file.size}
                  </span>

                </div>

              </div>

            </div>

            <div
              style={{
                display:"flex",
                gap:10,
                marginTop:16
              }}
            >

              <button

                onClick={() => onPreview?.(file)}

                style={{

                  flex:1,

                  border:"none",

                  borderRadius:14,

                  padding:"12px",

                  background:"#EFF6FF",

                  color:"#2563EB",

                  fontWeight:700,

                  display:"flex",

                  justifyContent:"center",

                  alignItems:"center",

                  gap:8,

                  cursor:"pointer"

                }}

              >

                <FaEye/>

                Aperçu

              </button>

              <button

                onClick={() => onDownload?.(file)}

                style={{

                  flex:1,

                  border:"none",

                  borderRadius:14,

                  padding:"12px",

                  background:"#2563EB",

                  color:"#fff",

                  fontWeight:700,

                  display:"flex",

                  justifyContent:"center",

                  alignItems:"center",

                  gap:8,

                  cursor:"pointer"

                }}

              >

                <FaDownload/>

                Télécharger

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Files;