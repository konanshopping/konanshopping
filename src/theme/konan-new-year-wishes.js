/*
 * KONAN SHOPPING CAMEROUN — Messages animés du Nouvel An
 * À importer une seule fois dans l'application React, par exemple dans App.jsx :
 * import "./theme/konan-new-year-wishes.js";
 *
 * L'année affichée est calculée automatiquement :
 * - avant janvier : année du prochain Nouvel An ;
 * - en janvier : année en cours.
 */

(() => {
  const ROOT_SELECTOR = 'html[data-season="new-year"]';
  const LAYER_CLASS = "konan-new-year-wishes-layer";

  const getNewYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    return now.getMonth() === 0 ? year : year + 1;
  };

  const buildMessages = (year) => [
    `BONNE ANNÉE ${year}`,
    `HAPPY NEW YEAR ${year}`,
    `01 JANVIER ${year}`,
    `MEILLEURS VŒUX ${year}`,
    `QUE CETTE ANNÉE ${year} SOIT MAGNIFIQUE`,
    `BIENVENUE ${year}`
  ];

  const createLayer = () => {
    const oldLayer = document.querySelector(`.${LAYER_CLASS}`);
    if (oldLayer) oldLayer.remove();

    const layer = document.createElement("div");
    layer.className = LAYER_CLASS;
    layer.setAttribute("aria-hidden", "true");

    const messages = buildMessages(getNewYear());

    // Les positions sont volontairement réparties sur toute la largeur.
    // Les délais décalés assurent une pluie continue sans paquet de textes.
    const settings = [
      { left: "8%",  delay: "-2s",  duration: "24s", rotate: "-5deg", drift: "34px" },
      { left: "27%", delay: "-13s", duration: "27s", rotate: "4deg",  drift: "-26px" },
      { left: "49%", delay: "-7s",  duration: "23s", rotate: "-3deg", drift: "22px" },
      { left: "70%", delay: "-19s", duration: "29s", rotate: "5deg",  drift: "-32px" },
      { left: "88%", delay: "-10s", duration: "26s", rotate: "-4deg", drift: "18px" },
      { left: "16%", delay: "-22s", duration: "28s", rotate: "3deg",  drift: "-20px" }
    ];

    messages.forEach((message, index) => {
      const item = document.createElement("span");
      item.className = "konan-new-year-wish";
      item.textContent = message;
      const config = settings[index];
      item.style.setProperty("--wish-left", config.left);
      item.style.setProperty("--wish-delay", config.delay);
      item.style.setProperty("--wish-duration", config.duration);
      item.style.setProperty("--wish-rotate", config.rotate);
      item.style.setProperty("--wish-drift", config.drift);
      layer.appendChild(item);
    });

    document.body.appendChild(layer);
  };

  const syncLayer = () => {
    if (!document.body) return;
    if (document.querySelector(ROOT_SELECTOR)) {
      createLayer();
    } else {
      document.querySelector(`.${LAYER_CLASS}`)?.remove();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncLayer, { once: true });
  } else {
    syncLayer();
  }

  // Permet de réagir si le thème saisonnier est activé après le chargement.
  const observer = new MutationObserver(syncLayer);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-season"]
  });

  // Actualise l'année au changement d'année si la page reste ouverte.
  let displayedYear = getNewYear();
  window.setInterval(() => {
    const currentYear = getNewYear();
    if (currentYear !== displayedYear) {
      displayedYear = currentYear;
      syncLayer();
    }
  }, 60 * 60 * 1000);
})();