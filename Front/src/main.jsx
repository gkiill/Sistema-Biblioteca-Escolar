import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

/*main.jsx — ponto de entrada. A ordem dos "envelopes" importa:

   BrowserRouter  -> habilita rotas/links em todo o app
     AuthProvider -> disponibiliza o usuário logado em todo o app
       App        -> as rotas */
       
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);