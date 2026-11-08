import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Correo del administrador autorizado estrictamente
export const ADMIN_EMAIL = "eliamjesusparedes@gmail.com";

// Web app Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAqU4tTXx27LOg2N9qz_oU-fxWeljCFUu4",
  authDomain: "portafolios-data.firebaseapp.com",
  databaseURL: "https://portafolios-data-default-rtdb.firebaseio.com",
  projectId: "portafolios-data",
  storageBucket: "portafolios-data.firebasestorage.app",
  messagingSenderId: "509820224348",
  appId: "1:509820224348:web:5a2719d84da1d1ccc87799",
  measurementId: "G-G3SYN7ZMMJ"
};

// Initialize Firebase App (prevent re-initialization in HMR)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Realtime Database: lo único que necesita la página pública.
// Auth vive en ./auth (solo lo importa el panel admin, en un chunk aparte).
export const db = firebaseConfig.databaseURL ? getDatabase(app) : null;

// Analytics se carga de forma diferida, después de que la página terminó de cargar,
// para que no compita con el render inicial.
if (typeof window !== "undefined") {
  const loadAnalytics = () => {
    import("firebase/analytics")
      .then(({ isSupported, getAnalytics }) =>
        isSupported().then((ok) => { if (ok) getAnalytics(app); })
      )
      .catch(() => { /* Analytics no soportado */ });
  };
  const idle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadAnalytics, { timeout: 5000 });
    else setTimeout(loadAnalytics, 3000);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}
