import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoaderPage from "./LoaderPage"; // ton nouveau loader

export default function PageLoader() {

  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Exclure Home et ProductDetails
  const excluded =
    location.pathname === "/" ||
    location.pathname.startsWith("/product/");

  useEffect(() => {

    if (excluded) return;

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);

  }, [location.pathname, excluded]);

  if (excluded) return null;

  return loading ? <LoaderPage /> : null;
}