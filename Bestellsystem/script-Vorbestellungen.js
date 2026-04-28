document.addEventListener('DOMContentLoaded', function () {
    // Datum von heute einlesen und anzeigen
    const heute = new Date();

    // Deutsche Wochentage im Array
    const tage = [
        "Sonntag", "Montag", "Dienstag",
        "Mittwoch", "Donnerstag", "Freitag", "Samstag"
    ];

    const wochentag = tage[heute.getDay()];
    const datum = heute.toLocaleDateString("de-DE");

    const datumElement = document.getElementById("datum");
    if (datumElement) {
        datumElement.innerText = wochentag + ", " + datum;
    }

    // Menüdaten für die Wochentage
    const menuByDay = {
        Montag: { name: "Pasta Pesto", price: "5,20 €", image: "img/pasta-pesto.jpeg", alt: "Pasta Pesto" },
        Dienstag: { name: "Gericht2", price: "4,10 €", image: "img/currywurst.jpg", alt: "Currywurst mit Pommes" },
        Mittwoch: { name: "Gericht3", price: "4,10 €", image: "img/currywurst.jpg", alt: "Currywurst mit Pommes" },
        Donnerstag: { name: "Gebratener Lachs mit Gemüse", price: "5,90 €", image: "img/lachs.jpg", alt: "Gebratener Lachs mit Gemüse" },
        Freitag: { name: "Currywurst mit Pommes", price: "4,10 €", image: "img/currywurst.jpg", alt: "Currywurst mit Pommes" }
    };

    // Array für die aktuelle Bestellliste
    let orderItems = [];

    // Den Textpreis wie "4,10 €" in eine Zahl wandeln
    function parsePrice(priceText) {
        const cleaned = priceText.replace(/[^\d,.-]/g, "");
        return Number(cleaned.replace(",", "."));
    }

    // Numerischen Preis in deutsches Format umwandeln
    function formatPrice(amount) {
        return amount.toFixed(2).replace(".", ",") + " €";
    }

    // Aktuelles Gericht in der Vorschau aktualisieren
    function updateDish(weekday, datumText) {
        const dish = menuByDay[weekday] || menuByDay.Freitag;
        const nameElement = document.getElementById("gericht-name");
        const priceElement = document.getElementById("gericht-preis");
        const dishImage = document.querySelector(".gericht-bild");
        const tagElement = document.getElementById("gericht-tag");
        const datumElement = document.getElementById("gericht-datum");

        if (nameElement) nameElement.innerText = dish.name;
        if (priceElement) priceElement.innerText = dish.price;
        if (dishImage) {
            dishImage.src = dish.image;
            dishImage.alt = dish.alt;
        }
        if (tagElement) tagElement.innerText = weekday;
        if (datumElement && datumText) datumElement.innerText = datumText;
    }

    // Bestellübersicht rechts neu zeichnen
    function updateOrderSummary() {
        const orderList = document.getElementById("order-list");
        const totalElement = document.getElementById("order-total");
        if (!orderList || !totalElement) return;

        orderList.innerHTML = "";
        let total = 0;

        if (orderItems.length === 0) {
            const emptyRow = document.createElement("div");
            emptyRow.className = "bestell-zeile";
            emptyRow.innerText = "Noch keine Vorbestellung.";
            orderList.appendChild(emptyRow);
        } else {
            orderItems.forEach(function (item) {
                const row = document.createElement("div");
                row.className = "bestell-zeile";
                row.innerHTML = `<div class="gerichts-info">
                             <div class="gerichtnamezeile">
                                 <span>1x ${item.name}<br>${item.date}</span>
                                 <span class="preis">${item.price}</span>
                                 <button class="remove-button">x</button>
                             </div>
                          </div>`;

                const removeButton = row.querySelector(".remove-button");
                if (removeButton) {
                    removeButton.addEventListener("click", function () {
                        orderItems = orderItems.filter(i => i !== item);
                        updateOrderSummary();
                    });
                }

                orderList.appendChild(row);
                total += parsePrice(item.price);
            });
        }

        totalElement.innerText = formatPrice(total);
    }

    // Aktuelles Gericht zur Bestellliste hinzufügen
    function addOrderItem() {
        const nameElement = document.getElementById("gericht-name");
        const priceElement = document.getElementById("gericht-preis");
        const datumSelect = document.getElementById("datum-select");
        const itemElement = document.querySelector(".gericht-bild");
        if (!nameElement || !priceElement || !datumSelect) return;

        const selectedDate = datumSelect.selectedOptions[0]?.textContent || datum;

        orderItems.push({
            date: selectedDate,
            name: nameElement.innerText,
            price: priceElement.innerText,
            image: itemElement ? itemElement.src : ""
        });
        updateOrderSummary();

        localStorage.setItem("Bestellung", JSON.stringify(orderItems));
    }

    // Datumsauswahl mit den nächsten 14 Werktagen befüllen
    const datumSelect = document.getElementById("datum-select");
    if (datumSelect) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 14);

        let addedDays = 0;
        let currentDate = new Date(startDate);

        while (addedDays < 14) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                const tagName = tage[dayOfWeek];
                const datumString = currentDate.toLocaleDateString("de-DE");
                const option = document.createElement("option");
                option.value = currentDate.toISOString().split('T')[0];
                option.textContent = `${tagName}, ${datumString}`;
                option.dataset.weekday = tagName;
                datumSelect.appendChild(option);
                addedDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        datumSelect.addEventListener("change", function () {
            const weekday = this.selectedOptions[0]?.dataset.weekday;
            const datumText = this.selectedOptions[0]?.textContent;
            if (weekday) {
                updateDish(weekday, datumText);
            }
        });

        if (datumSelect.options.length > 0) {
            datumSelect.selectedIndex = 0;
            updateDish(datumSelect.options[0].dataset.weekday, datumSelect.options[0].textContent);
        }
    }

    // Klick-Event auf den Bestellbutton setzen
    const addButton = document.getElementById("add-order-button");
    if (addButton) {
        addButton.addEventListener("click", addOrderItem);
    }

    // Beim Abschicken: Bestellung im localStorage speichern
    const abschickenButton = document.querySelector(".vorbestellung-button");
    if (abschickenButton) {
        abschickenButton.addEventListener("click", function (e) {
            if (orderItems.length === 0) {
                e.preventDefault();
                alert("Bitte füge zuerst ein Gericht zur Bestellung hinzu.");
                return;
            }
            const vorhandene = JSON.parse(localStorage.getItem("bestellungen")) || [];
            const alleBestellungen = vorhandene.concat(orderItems);
            localStorage.setItem("bestellungen", JSON.stringify(alleBestellungen));
        });
    }

    // Zu Beginn die Bestellübersicht initial anzeigen
    updateOrderSummary();
});
