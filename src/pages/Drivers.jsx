import { useEffect, useState } from "react";
import axios from "axios";

import { Navigate } from "react-router-dom";

export default function Drivers() {

const admin = JSON.parse(
  localStorage.getItem("admin")
);

  const [drivers, setDrivers] =
    useState([]);

  useEffect(() => {

    fetchDrivers();

  }, []);

  const fetchDrivers = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/drivers"
      );

      setDrivers(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const deleteDriver = async (id) => {

    if (
      !window.confirm(
        "Supprimer ce livreur ?"
      )
    ) return;

    try {

      await axios.delete(
        `http://localhost:5000/drivers/${id}`
      );

      setDrivers(
        drivers.filter(
          (d) => d._id !== id
        )
      );

    } catch (err) {

      console.log(err);

    }

  };

if (!admin) {

  return <Navigate to="/" />;

}

  return (

    <div
      style={{
        padding: "24px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "900",
          marginBottom: "24px",
        }}
      >
        🚚 Liste des livreurs
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >

        {drivers.map((driver) => (

          <div
            key={driver._id}

            style={{
              background: "white",
              borderRadius: "22px",
              padding: "20px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                  }}
                >
                  {driver.name}
                </h2>

                <p>
                  📞 {driver.phone}
                </p>

                <p>
                  🚗 {driver.vehicle}
                </p>

                <p>
                  📍 {driver.city}
                </p>

              </div>

              <button

                onClick={() =>
                  deleteDriver(
                    driver._id
                  )
                }

                style={{
                  background:
                    "#ef4444",
                  color: "white",
                  border: "none",
                  padding:
                    "12px 18px",
                  borderRadius:
                    "14px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                🗑 Supprimer
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}