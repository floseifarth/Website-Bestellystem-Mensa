import { supabase } from "./supabaseClient.js";

// Zeigt eine Rueckmeldung unter dem Login-Formular an.
// `isError` steuert die Farbe der Nachricht (rot bei Fehler, gruen bei Erfolg/Info).
function setMessage(text, isError) {
    // Das Ausgabeelement fuer Login-Nachrichten holen.
    const messageElement = document.getElementById("login-message");
    // Falls das Element nicht existiert, Funktion sicher beenden.
    if (!messageElement) return;

    // Textinhalt der Nachricht setzen.
    messageElement.textContent = text;
    // Farblich zwischen Fehler und Erfolg unterscheiden.
    // messageElement.style.color = isError ? "#b42318" : "#027a48";
}

// Fuehrt den eigentlichen Login-Prozess aus.
async function login() {
    // Eingabefelder fuer E-Mail und Passwort aus dem DOM lesen.
    const emailElement = document.getElementById("login-email");
    const passwordElement = document.getElementById("login-password");

    // Falls Felder nicht gefunden werden, Abbruch ohne Fehler.
    if (!emailElement || !passwordElement) {
        return;
    }

    // Benutzerwerte einlesen (E-Mail mit trim, um Leerzeichen am Rand zu entfernen).
    const email = emailElement.value.trim();
    const password = passwordElement.value;

    // Einfache Pflichtfeld-Pruefung vor dem API-Aufruf.
    if (!email || !password) {
        setMessage("Bitte E-Mail und Passwort eingeben.", true);
        return;
    }

    // Info an den Nutzer: Login wird gerade geprueft.
    setMessage("Anmeldung wird geprueft...", false);

    // Login-Anfrage an Supabase Auth schicken.
    // Bei Erfolg kommt eine Session zurueck, bei Fehler ist `error` gesetzt.
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    // Fehlerfall: Fehlermeldung anzeigen und Funktion beenden.
    if (error) {
        setMessage("Login fehlgeschlagen: " + error.message, true);
        return;
    }

    // Erfolgsfall: Erfolgsmeldung anzeigen und auf Startseite weiterleiten.
    setMessage("Login erfolgreich. Weiterleitung...", false);
    window.location.href = "Startseite.html";
}

// Wartet, bis das HTML vollstaendig geladen ist,
// und verbindet dann die Eingaben mit der Login-Funktion.
document.addEventListener("DOMContentLoaded", function () {
    // Login-Button und Passwortfeld holen.
    const loginButton = document.getElementById("login-button");
    const passwordInput = document.getElementById("login-password");

    // Klick auf den Login-Button startet den Login-Prozess.
    if (loginButton) {
        loginButton.addEventListener("click", login);
    }

    // Enter im Passwortfeld startet ebenfalls den Login.
    if (passwordInput) {
        passwordInput.addEventListener("keydown", function (event) {
            // Nur bei Enter ausloesen.
            if (event.key === "Enter") {
                login();
            }
        });
    }
});
