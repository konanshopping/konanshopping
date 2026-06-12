import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {

  const { token } =
    useParams();

  const [password,
    setPassword] =
    useState("");

  const updatePassword =
    async () => {

      try {

        await axios.post(

          `https://konanshopping-production.up.railway.app/reset-password/${token}`,

          {
            password,
          }
        );

        toast.success(
          "Mot de passe changé ✅"
        );

      } catch {

        toast.error(
          "Lien invalide"
        );

      }

    };

  return (

    <div>

      <h1>
        Nouveau mot de passe
      </h1>

      <input
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        onClick={
          updatePassword
        }
      >
        Enregistrer
      </button>

    </div>
  );
}

export default ResetPassword;