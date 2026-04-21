document.addEventListener('DOMContentLoaded', function () {

    // Preis von Zahl in deutsches Format umwandeln (z.B. 4.10 → "4,10 €")
    function formatPrice(amount) {
        return amount.toFixed(2).replace(".", ",") + " €";
    }

    // Preis aus Text in Zahl umwandeln (z.B. "4,10 €" → 4.1)
    function parsePrice(priceText) {
        const cleaned = priceText.replace(/[^\d,.-]/g, "");
        return Number(cleaned.replace(",", "."));
    }

    // Bestellliste im HTML und gespeicherte Bestellungen aus localStorage holen
    const orderList = document.getElementById("order-list");
    const bestellungen = JSON.parse(localStorage.getItem("bestellungen")) || [];

    if (!orderList) return;

    // Liste leeren bevor neu befüllt wird
    orderList.innerHTML = "";

    if (bestellungen.length === 0) {
        // Platzhalter anzeigen wenn keine Bestellungen vorhanden
        const emptyRow = document.createElement("div");
        emptyRow.className = "bestell-zeile";
        emptyRow.innerText = "Noch keine Vorbestellung.";
        orderList.appendChild(emptyRow);
    } else {
        let total = 0;

        // Jede Bestellung als Zeile anzeigen
        bestellungen.forEach(function (item, index) {
            const row = document.createElement("div");
            row.className = "bestell-zeile";
            row.innerHTML = `<span>${item.date}</span><span>${item.name}</span><span class="preis">${item.price}</span><button class="remove-button">x</button>`;

            // Bestellung löschen wenn "x" geklickt wird
            const removeButton = row.querySelector(".remove-button");
            if (removeButton) {
                removeButton.addEventListener("click", function () {
                    bestellungen.splice(index, 1);
                    localStorage.setItem("bestellungen", JSON.stringify(bestellungen));
                    location.reload();
                });
            }

            orderList.appendChild(row);
            total += parsePrice(item.price);
        });

        // Gesamtpreis am Ende anzeigen
        const totalRow = document.createElement("div");
        totalRow.className = "bestell-zeile gesamt";
        totalRow.innerHTML = `<span>Gesamt</span><span class="preis">${formatPrice(total)}</span>`;
        orderList.appendChild(totalRow);
    }
});
