import React, { useState } from "react";
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
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    setSettings({

      ...settings,

      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,

    });

  };

  // =========================
  // SAVE
  // =========================

  const saveSettings = () => {

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
            className="settingsInput"
          />

          <input
            type="text"
            name="city"
            value={settings.city}
            onChange={handleChange}
            className="settingsInput"
          />

          <input
            type="text"
            name="address"
            value={settings.address}
            onChange={handleChange}
            className="settingsInput"
          />

          <input
            type="text"
            name="website"
            value={settings.website}
            onChange={handleChange}
            className="settingsInput"
          />

          <textarea
            rows="4"
            name="description"
            value={settings.description}
            onChange={handleChange}
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
            className="settingsInput"
          />

          <input
            type="text"
            name="whatsapp"
            value={settings.whatsapp}
            onChange={handleChange}
            className="settingsInput"
          />

          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
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
            className="settingsInput"
          />

          <input
            type="number"
            name="yaoundeShipping"
            value={settings.yaoundeShipping}
            onChange={handleChange}
            className="settingsInput"
          />

          <input
            type="number"
            name="otherShipping"
            value={settings.otherShipping}
            onChange={handleChange}
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
        onClick={saveSettings}
        className="saveButton"
      >

        <FaSave />

        Enregistrer les paramètres

      </button>

    </div>

  );
}