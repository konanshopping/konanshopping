import React from "react";

function KonanLoader() {

  const mobile = window.innerWidth <= 768;

  return (
    <>
      <style>{`

        @keyframes konanSpin{
          from{
            transform:rotate(0deg);
          }
          to{
            transform:rotate(360deg);
          }
        }

        @keyframes logoPulse{

          0%,100%{
            transform:translate(-50%,-50%) scale(1);
            box-shadow:
              0 0 10px rgba(75,46,131,.15);
          }

          50%{
            transform:translate(-50%,-50%) scale(1.08);
            box-shadow:
              0 0 24px rgba(124,58,237,.35);
          }

        }

        @keyframes fade{

          from{
            opacity:0;
          }

          to{
            opacity:1;
          }

        }

        @keyframes shimmer{

          0%{
            background-position:-200% 0;
          }

          100%{
            background-position:200% 0;
          }

        }

      `}</style>

      <div
        style={{
          position:"fixed",
          inset:0,
          background:"#fff",

          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column",

          zIndex:999999,

          animation:"fade .35s ease",
        }}
      >

        <div
          style={{
            position:"relative",

            width:mobile ? "74px" : "90px",
            height:mobile ? "74px" : "90px",
          }}
        >

          {/* Cercle */}

          <div
            style={{
              position:"absolute",
              inset:0,

              border:"3px solid #ECECF8",

              borderTop:"3px solid #4B2E83",

              borderRight:"3px solid #7C3AED",

              borderRadius:"50%",

              animation:"konanSpin .85s linear infinite",
            }}
          />

          {/* Logo */}

          <div
            style={{
              position:"absolute",

              top:"50%",
              left:"50%",

              transform:"translate(-50%,-50%)",

              width:mobile ? "46px" : "56px",
              height:mobile ? "46px" : "56px",

              borderRadius:"50%",

              overflow:"hidden",

              background:"#fff",

              border:"2px solid #fff",

              animation:"logoPulse 1.8s ease-in-out infinite",

              boxShadow:
                "0 8px 22px rgba(75,46,131,.18)",
            }}
          >

            <img
              src="/logo.jpg"
              alt="Konan Shopping"
              style={{
                width:"100%",
                height:"100%",
                objectFit:"cover",
                display:"block",
              }}
            />

          </div>

        </div>

        {/* Texte animé */}

        <div
          translate="no"
          style={{
            marginTop:"18px",

            fontSize:mobile ? "11px" : "12px",

            fontStyle:"italic",

            fontWeight:"600",

            letterSpacing:"1.2px",

            textTransform:"lowercase",

            background:
              "linear-gradient(90deg,#B8BCC8 20%,#4B2E83 50%,#B8BCC8 80%)",

            backgroundSize:"200% auto",

            WebkitBackgroundClip:"text",

            WebkitTextFillColor:"transparent",

            animation:"shimmer 1.8s linear infinite",

            userSelect:"none",
          }}
        >
          konan shopping
        </div>

      </div>
    </>
  );
}

export default KonanLoader;