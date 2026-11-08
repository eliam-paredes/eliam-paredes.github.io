import { getAuth } from "firebase/auth";
import { app } from "./config";

// Solo lo importa el panel admin (cargado con lazy), así Auth no entra en el bundle público.
export const auth = getAuth(app);
export { ADMIN_EMAIL } from "./config";
