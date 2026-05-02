import { supabase } from "./supabaseClient.js";

// Seite ist bereit – Session und Name laden.
document.addEventListener("DOMContentLoaded", async function () {

    // Aktuelle Supabase-Session abrufen (gespeichert nach dem Login).
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    // Kein eingeloggter User? Zurueck zur Anmeldeseite.
    if (!user) {
        window.location.href = "Anmeldestartseite.html";
        return;
    }

    // Anzeigenamen aus den User-Metadaten holen.

    const displayName =
        user.user_metadata?.full_name ||       // Alternativ: vollstaendiger Name
        user.user_metadata?.display_name ||   // Benutzerdefinierter Anzeigename
        user.email;                            // Fallback: E-Mail-Adresse

    // Namen rechts oben im Profil-Bereich einsetzen.
    const nameElement = document.getElementById("user-display-name");
    if (nameElement) {
        nameElement.textContent = displayName;
    }

});
