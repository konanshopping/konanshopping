import { useState } from "react";

import axios from "axios";

export default function DriverRegister() {

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      password: "",

      phone: "",

      city: "",

      vehicle: "",

      plate: "",

    });

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const register =
    async () => {

      try {

        setLoading(true);

        // =========================
        // PHOTO UPLOAD
        // =========================

        let photoUrl = "";

        if (image) {

          const data =
            new FormData();

          data.append(
            "image",
            image
          );

          const upload =
            await axios.post(

              "https://konanshopping.onrender.com/upload",

              data

            );

          photoUrl =
            upload.data.imageUrl;

        }

        // =========================
        // REGISTER DRIVER
        // =========================

    await axios.post(
  "https://konanshopping.onrender.com/driver-register",
  {
    ...form,
    photo: photoUrl,
  }
);

        alert(
          "Compte livreur créé 🚚"
        );

        window.location.href =
          "/driver-login";

      } catch (err) {

        console.log(err);

        alert(
          "Erreur inscription"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        background:
          "linear-gradient(135deg,#eef2ff,#f8fafc)",

        padding: "20px",
      }}
    >

      <div
        style={{
          background: "white",

          padding: "38px",

          borderRadius:
            "32px",

          width: "100%",

          maxWidth: "470px",

          boxShadow:
            "0 25px 60px rgba(15,23,42,0.08)",

          border:
            "1px solid #eef2ff",

          position: "relative",

          overflow: "hidden",
        }}
      >

        {/* EFFECT */}

        <div
          style={{
            position: "absolute",

            top: "-120px",

            right: "-120px",

            width: "240px",

            height: "240px",

            borderRadius: "50%",

            background:
              "rgba(91,61,245,0.08)",

            filter: "blur(40px)",
          }}
        />

        {/* HEADER */}

        <div
          style={{
            textAlign: "center",

            marginBottom: "30px",

            position: "relative",

            zIndex: 2,
          }}
        >

          <div
            style={{
              width: "92px",

              height: "92px",

              borderRadius: "28px",

              margin: "0 auto",

              background:
                "linear-gradient(135deg,#5b3df5,#7c4dff)",

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              fontSize: "42px",

              color: "white",

              boxShadow:
                "0 15px 40px rgba(91,61,245,0.35)",
            }}
          >
            🚚
          </div>

          <h1
            style={{
              marginTop: "24px",

              color: "#0f172a",

              fontSize: "32px",

              fontWeight: "900",

              marginBottom: "8px",
            }}
          >
            Livreur Konan
          </h1>

          <p
            style={{
              color: "#64748b",

              lineHeight: "24px",

              fontSize: "14px",

              margin: 0,
            }}
          >
            Rejoignez les partenaires
            de livraison Konan Shopping
            Cameroun
          </p>

        </div>

        {/* INPUTS */}

        {Object.keys(form).map(
          (key) => (

            <div
              key={key}
              style={{
                marginTop: "14px",

                position: "relative",

                zIndex: 2,
              }}
            >

              <input

                type={
                  key === "password"
                    ? "password"

                    : key === "email"
                    ? "email"

                    : "text"
                }

                placeholder={
                  key === "name"
                    ? "Nom complet"

                  : key === "email"
                    ? "Adresse email"

                  : key === "password"
                    ? "Mot de passe"

                  : key === "phone"
                    ? "Téléphone"

                  : key === "city"
                    ? "Ville"

                  : key === "vehicle"
                    ? "Moto / voiture"

                  : "Plaque véhicule"
                }

                value={form[key]}

                onChange={(e) =>

                  setForm({

                    ...form,

                    [key]:
                      e.target.value,

                  })

                }

                style={{
                  width: "100%",

                  padding:
                    "16px 18px",

                  borderRadius:
                    "18px",

                  border:
                    "1px solid #e2e8f0",

                  outline: "none",

                  fontSize: "15px",

                  boxSizing:
                    "border-box",

                  background:
                    "#f8fafc",

                  color:
                    "#0f172a",
                }}
              />

            </div>

          )
        )}

        {/* PHOTO */}

        <div
          style={{
            marginTop: "18px",

            position: "relative",

            zIndex: 2,
          }}
        >

          <label
            style={{
              display: "block",

              marginBottom: "10px",

              color: "#111827",

              fontWeight: "700",

              fontSize: "14px",
            }}
          >
            📸 Photo du livreur
          </label>

          <input
            type="file"

            accept="image/*"

            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }

            style={{
              width: "100%",
            }}
          />

        </div>

        {/* PREVIEW */}

        {image && (

          <div
            style={{
              marginTop: "22px",

              display: "flex",

              justifyContent:
                "center",

              position: "relative",

              zIndex: 2,
            }}
          >

            <img
              src={
                URL.createObjectURL(
                  image
                )
              }

              alt="preview"

              style={{
                width: "95px",

                height: "95px",

                borderRadius: "50%",

                objectFit: "cover",

                border:
                  "4px solid #ede9fe",

                boxShadow:
                  "0 10px 30px rgba(91,61,245,0.18)",
              }}
            />

          </div>

        )}

        {/* BUTTON */}

        <button
          onClick={register}

          disabled={loading}

          style={{
            width: "100%",

            padding: "18px",

            marginTop: "28px",

            border: "none",

            borderRadius:
              "20px",

            background:
              "linear-gradient(135deg,#5b3df5,#7c4dff)",

            color: "white",

            fontWeight:
              "800",

            cursor:
              "pointer",

            fontSize:
              "16px",

            boxShadow:
              "0 15px 35px rgba(91,61,245,0.35)",

            position: "relative",

            zIndex: 2,
          }}
        >
          {loading
            ? "Chargement..."
            : "🚚 Créer mon compte"}
        </button>

      </div>

    </div>

  );

}