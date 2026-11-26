import { useEffect } from "react";
import { getSeasonalTheme } from "./seasonalCalendar";

// Styles communs et thèmes saisonniers.
// Chaque thème est isolé par :root[data-season="..."].
import "./themes/base.css";
import "./themes/new-year.css";
import "./themes/christmas.css";
import "./themes/valentine.css";
import "./themes/womens-day.css";
import "./themes/easter.css";
import "./themes/labour-day.css";
import "./themes/cameroon-national-day.css";
import "./themes/back-to-school.css";
import "./themes/halloween.css";
import "./themes/black-friday.css";
import "./themes/ramadan.css";
import "./themes/tabaski.css";
import "./themes/mothers-day.css";
import "./themes/fathers-day.css";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    let intervalId;

    const applyTheme = () => {
      const theme = getSeasonalTheme();
      const root = document.documentElement;

      if (root.dataset.season !== theme) {
        root.dataset.season = theme;
      }
    };

    // Appliquer immédiatement le thème correspondant à la date locale.
    applyTheme();

    // Vérification périodique, notamment après une sortie de veille.
    intervalId = window.setInterval(applyTheme, 60 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        applyTheme();
      }
    };

    window.addEventListener("focus", applyTheme);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", applyTheme);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return children;
}
