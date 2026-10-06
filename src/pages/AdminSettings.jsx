import React, { useEffect, useState } from "react";

import "./AdminSettings.css";



import {

  FaStore,

  FaPhone,

  FaTruck,

  FaBell,

  FaMoon,

  FaShieldAlt,

  FaSave,

  FaWhatsapp,

  FaEnvelope,

  FaMapMarkerAlt,

  FaGlobeAfrica,

  FaCog,

} from "react-icons/fa";



// ============================================================

// SÉCURITÉ ADMIN

// La logique métier d'origine est conservée.

// Ce composant ne faisait aucun appel backend.

// ============================================================



const MAX_TEXT_LENGTH = 150;

const MAX_DESCRIPTION_LENGTH = 1000;

const MAX_PHONE_LENGTH = 30;

const MAX_EMAIL_LENGTH = 150;

const MAX_WEBSITE_LENGTH = 200;



const ALLOWED_PAYMENT_METHODS = [

  "Paiement à la livraison",

  "Orange Money",

  "MTN Mobile Money",

  "Carte bancaire",

];



const safeParse = (value, fallback = null) => {

  try {

    return value ? JSON.parse(value) : fallback;

  } catch {

    return fallback;

  }

};



// ============================================================
// 🔐 AUTHENTIFICATION ADMIN PAR COOKIE HTTPONLY
// ============================================================
// Le JWT n'est plus lu depuis localStorage.
// Le navigateur envoie automatiquement le cookie HttpOnly.
// La logique métier de la page reste inchangée.
// ============================================================

const getStoredAdmin = () => {
  try {
    return safeParse(localStorage.getItem("admin"), null);
  } catch {
    return null;
  }
};

const requireAdminSession = () => {
  const admin = getStoredAdmin();

  if (!admin) {
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/admin-login"
    ) {
      window.location.replace("/admin-login");
    }

    return false;
  }

  return true;
};

const normalizeText = (

  value,

  maxLength

) =>

  typeof value === "string"

    ? value.slice(0, maxLength)

    : "";



const normalizeNumber = (value) => {

  const number = Number(value);



  return Number.isFinite(number) && number >= 0

    ? number

    : 0;

};



export default function AdminSettings() {



  const [settings, setSettings] = useState({



    // BOUTIQUE

    storeName: "KonanShopping Cameroun",



    city: "Douala",



    address:

      "Akwa, Douala - Cameroun",



    website:

      "www.konanshopping.cm",



    description:

      "Plateforme professionnelle de vente en ligne au Cameroun.",



    // CONTACT

    phone: "+237 699 99 99 99",



    whatsapp:

      "+237 677 77 77 77",



    email:

      "contact@konanshopping.com",



    // LIVRAISON

    doualaShipping: 1500,



    yaoundeShipping: 2500,



    otherShipping: 3500,



    paymentMethod:

      "Paiement à la livraison",



    // SYSTEME

    darkMode: true,



    notifications: true,

  });



  // =========================

  // ADMIN SESSION

  // =========================



  useEffect(() => {



    requireAdminSession();



  }, []);



  // =========================

  // HANDLE CHANGE

  // =========================



  const handleChange = (e) => {



    if (!requireAdminSession()) {

      return;

    }



    const {

      name,

      value,

      type,

      checked,

    } = e.target;



    if (type === "checkbox") {



      setSettings((previous) => ({

        ...previous,

        [name]: checked,

      }));



      return;

    }



    let safeValue = value;



    if (

      name === "storeName" ||

      name === "city" ||

      name === "address"

    ) {

      safeValue = normalizeText(

        value,

        MAX_TEXT_LENGTH

      );

    }



    if (name === "website") {

      safeValue = normalizeText(

        value,

        MAX_WEBSITE_LENGTH

      );

    }



    if (name === "description") {

      safeValue = normalizeText(

        value,

        MAX_DESCRIPTION_LENGTH

      );

    }



    if (

      name === "phone" ||

      name === "whatsapp"

    ) {

      safeValue = normalizeText(

        value,

        MAX_PHONE_LENGTH

      );

    }



    if (name === "email") {

      safeValue = normalizeText(

        value,

        MAX_EMAIL_LENGTH

      );

    }



    if (

      name === "doualaShipping" ||

      name === "yaoundeShipping" ||

      name === "otherShipping"

    ) {

      safeValue = normalizeNumber(value);

    }



    if (name === "paymentMethod") {

      if (

        !ALLOWED_PAYMENT_METHODS.includes(

          value

        )

      ) {

        return;

      }

    }



    setSettings((previous) => ({

      ...previous,

      [name]: safeValue,

    }));



  };



  // =========================

  // SAVE

  // =========================



  const saveSettings = () => {



    if (!requireAdminSession()) {

      return;

    }



    alert(

      "✅ Paramètres enregistrés avec succès"

    );



  };



  return (



    <div className="adminSettings">



      {/* HEADER */}



      <div className="settingsHeader">



        <div className="headerLeft">



          <div className="headerIcon">

            <FaCog />

          </div>



          <div>



            <h1 className="settingsTitle">

              Paramètres Admin

            </h1>



            <p className="settingsSubtitle">

              Gestion professionnelle

              KonanShopping Cameroun

            </p>



          </div>



        </div>



      </div>



      {/* GRID */}



      <div className="settingsGrid">



        {/* BOUTIQUE */}



        <div className="settingsCard">



          <div className="cardTitle">



            <FaStore color="#4f46e5" />



            <h2>Boutique</h2>



          </div>



          <input

            type="text"

            name="storeName"

            value={settings.storeName}

            onChange={handleChange}

            maxLength={MAX_TEXT_LENGTH}

            autoComplete="organization"

            className="settingsInput"

          />



          <input

            type="text"

            name="city"

            value={settings.city}

            onChange={handleChange}

            maxLength={MAX_TEXT_LENGTH}

            autoComplete="address-level2"

            className="settingsInput"

          />



          <input

            type="text"

            name="address"

            value={settings.address}

            onChange={handleChange}

            maxLength={MAX_TEXT_LENGTH}

            autoComplete="street-address"

            className="settingsInput"

          />



          <input

            type="text"

            name="website"

            value={settings.website}

            onChange={handleChange}

            maxLength={MAX_WEBSITE_LENGTH}

            autoComplete="url"

            spellCheck="false"

            className="settingsInput"

          />



          <textarea

            rows="4"

            name="description"

            value={settings.description}

            onChange={handleChange}

            maxLength={MAX_DESCRIPTION_LENGTH}

            className="settingsTextarea"

          />



        </div>



        {/* CONTACT */}



        <div className="settingsCard">



          <div className="cardTitle">



            <FaPhone color="#10b981" />



            <h2>Contact</h2>



          </div>



          <input

            type="text"

            name="phone"

            value={settings.phone}

            onChange={handleChange}

            maxLength={MAX_PHONE_LENGTH}

            inputMode="tel"

            autoComplete="tel"

            className="settingsInput"

          />



          <input

            type="text"

            name="whatsapp"

            value={settings.whatsapp}

            onChange={handleChange}

            maxLength={MAX_PHONE_LENGTH}

            inputMode="tel"

            autoComplete="tel"

            className="settingsInput"

          />



          <input

            type="email"

            name="email"

            value={settings.email}

            onChange={handleChange}

            maxLength={MAX_EMAIL_LENGTH}

            autoComplete="email"

            spellCheck="false"

            className="settingsInput"

          />



          <div className="infoBox">



            <FaMapMarkerAlt />



            <span>

              Douala - Cameroun

            </span>



          </div>



          <div className="infoBox">



            <FaGlobeAfrica />



            <span>

              Livraison disponible

              partout au Cameroun

            </span>



          </div>



        </div>



        {/* LIVRAISON */}



        <div className="settingsCard">



          <div className="cardTitle">



            <FaTruck color="#f59e0b" />



            <h2>Livraison</h2>



          </div>



          <input

            type="number"

            name="doualaShipping"

            value={settings.doualaShipping}

            onChange={handleChange}

            min="0"

            step="1"

            inputMode="numeric"

            className="settingsInput"

          />



          <input

            type="number"

            name="yaoundeShipping"

            value={settings.yaoundeShipping}

            onChange={handleChange}

            min="0"

            step="1"

            inputMode="numeric"

            className="settingsInput"

          />



          <input

            type="number"

            name="otherShipping"

            value={settings.otherShipping}

            onChange={handleChange}

            min="0"

            step="1"

            inputMode="numeric"

            className="settingsInput"

          />



          <select

            name="paymentMethod"

            value={settings.paymentMethod}

            onChange={handleChange}

            className="settingsSelect"

          >



            <option>

              Paiement à la livraison

            </option>



            <option>

              Orange Money

            </option>



            <option>

              MTN Mobile Money

            </option>



            <option>

              Carte bancaire

            </option>



          </select>



        </div>



        {/* SYSTEME */}



        <div className="settingsCard">



          <div className="cardTitle">



            <FaShieldAlt color="#ef4444" />



            <h2>Système</h2>



          </div>



          <div className="toggleCard">



            <span>

              <FaMoon />

              Mode sombre

            </span>



            <input

              type="checkbox"

              name="darkMode"

              checked={settings.darkMode}

              onChange={handleChange}

            />



          </div>



          <div className="toggleCard">



            <span>

              <FaBell />

              Notifications

            </span>



            <input

              type="checkbox"

              name="notifications"

              checked={

                settings.notifications

              }

              onChange={handleChange}

            />



          </div>



          <div className="systemBox">



            <p>

              🔐 Sécurité :

              Protection active

            </p>



            <p>

              🚀 Version :

              Konan Admin v2.0

            </p>



            <p>

              🌍 Région :

              Cameroun

            </p>



          </div>



        </div>



      </div>



      {/* SAVE BUTTON */}



      <button

        type="button"

        onClick={saveSettings}

        className="saveButton"

      >



        <FaSave />



        Enregistrer les paramètres



      </button>



    </div>



  );

}