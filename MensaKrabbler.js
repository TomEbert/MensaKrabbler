function printWeekday(weekday) {
  var outputText = document.getElementById("output-text");
  outputText.value = runCrawler(weekday);
}

function runCrawler(weekday) {
  // Hier kannst du den JavaScript-Code einfügen, um den Krabbler auszuführen und den Text zurückzugeben
  // Du kannst die entsprechende Logik implementieren, um den Krabbler für den angegebenen Wochentag auszuführen
  // und den Text zu erstellen, den du im outputText-Feld anzeigen möchtest.

  // Rufe die run methode aus dem MensaKrabbler.js script auf und speichere das Ergebnis in der Variable result
  var result = run(weekday);

  // Lass die MensaKrabbler.py laufen

  return "Ergebnis für " + weekday + " Krabbler";
}

function exitProgram() {
  // Hier kannst du den JavaScript-Code einfügen, um das Programm zu beenden, wenn nötig.
  console.log("Programm beendet.");
}

// Erstelle ein Enum für die Wochentage, um es der run-Funktion zu übergeben
const Weekday = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4
};

function runCrawler(weekday) {
  function getDate(weekday) {
    const now = new Date();
    const currentWeekday = now.getDay();
    const diff = (weekday - currentWeekday + 7) % 7;
    const nextDate = new Date(now.setDate(now.getDate() + diff));
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0");
    const day = String(nextDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const date = getDate(weekday);

  const formData = new FormData();
  formData.append("func", "make_spl");
  formData.append("locId", "2");
  formData.append("date", date);
  formData.append("lang", "de");
  formData.append("startThisWeek", getMondayDate());
  formData.append("startNextWeek", getNextMondayDate());

  const url = 'https://sws2.maxmanager.xyz/inc/ajax-php_konnektor.inc.php';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
      'Accept-Language': 'en-us',
      'Accept-Encoding': 'gzip, deflate, br',
      'Host': 'sws2.maxmanager.xyz',
      'Origin': 'https://sws2.maxmanager.xyz',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
      'Connection': 'keep-alive',
      'Referer': 'https://sws2.maxmanager.xyz/',
      'Content-Length': formData.toString().length,
      'Cookie': 'locId=2; domain=sws2.maxmanager.xyz; savekennzfilterinput=0; splsws=rhom9pct0fu7q8rvhg6i51m0sc',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formData
  })
    .then((response) => response.text())
    .then((html) => {
      // Verarbeite das HTML hier
      console.log(html);
    })
    .catch((error) => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });

  

  // fetch("https://api.allorigins.win/post?url=" + encodeURIComponent("https://sws2.maxmanager.xyz/inc/ajax-php_konnektor.inc.php"), {
  //   method: "POST",
  //   mode: "no-cors",
  //   headers: {
  //     // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //     // 'Accept': '*/*',
  //     // 'Accept-Language': 'en-us',
  //     // 'Accept-Encoding': 'gzip, deflate, br',
  //     'Host': 'sws2.maxmanager.xyz',
  //     'Origin': 'https://sws2.maxmanager.xyz',
  //     // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  //     // 'Connection': 'keep-alive',
  //     'Referer': 'https://sws2.maxmanager.xyz/index.php?mode=bed',
  //     // 'Content-Length': '95',
  //     'Cookie': 'domain=sws2.maxmanager.xyz; locId=2; savekennzfilterinput=0; splsws=rhom9pct0fu7q8rvhg6i51m0sc',
  //   },
  //   body: formData
  // })
  // .then((response) => response.text())
  // .then((data) => {
  //   const html = data.contents;
  //   const result = parseHTML(html);
  //   const outputText = document.getElementById("output-text");
  //   outputText.textContent = result;
  // })
  // .catch((error) => {
  //   console.error("Ein Fehler ist aufgetreten:", error);
  // });

}


function crawlWebsite() {
  const url = 'https://sws2.maxmanager.xyz'; // Die URL der zu crawlenden Website

  fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(url))
    .then(response => response.json())
    .then(data => {
      const html = data.contents; // Der gecrawlte HTML-Inhalt der Website
      // Verarbeite den HTML-Inhalt nach Bedarf und zeige ihn in deiner Webanwendung an
      console.log(html); // Beispiel: Gib den HTML-Inhalt in der Konsole aus
    })
    .catch(error => {
      console.error('Fehler beim Crawlen der Website:', error);
    });
}

// Erstelle eine Funktion, die den gesamten Code ausführt
function run(weekday) {
  // Funktion, um das Datum des übergebenen Wochentags zu erhalten
  function getDate(weekday) {
    const now = new Date();
    const currentWeekday = now.getDay();
    const diff = (weekday - currentWeekday + 7) % 7;
    const nextDate = new Date(now.setDate(now.getDate() + diff));
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0");
    const day = String(nextDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const date = getDate(weekday);

  // runCrawler(date);
  // crawlWebsite();

  // fetch("https://sws2.maxmanager.xyz/inc/ajax-php_konnektor.inc.php", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  //     "Origin": "https://sws2.maxmanager.xyz",
  //   },
  //   body: `func=make_spl&locId=2&date=${date}&lang=de&startThisWeek=${getMondayDate()}&startNextWeek=${getNextMondayDate()}`
  // })
  //   .then((response) => response.text())
  //   .then((html) => {
  //     // Verarbeite das HTML hier
  //     const result = parseHTML(html);

  //     // Gib das Ergebnis aus
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.error("Ein Fehler ist aufgetreten:", error);
  //   });
}

// Funktionen zum Parsen des HTML-Strings und Extrahieren der Daten
function parseHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Definiere die Klassen für die relevanten Elemente
  const mealClass = "row splMeal";
  const nameSelector = "span";
  const fotoSelector = "img";
  const preisSelector = ".col-md-2.col-sm-3.visible-sm-block.visible-md-block.visible-lg-block div";
  const veganIconClass = "iconLarge";
  const co2Selector = ".azn.hidden.size-13 div";
  
  const meals = Array.from(doc.querySelectorAll(`.${mealClass}`)).map((meal) => {
    const name = meal.querySelector(nameSelector).textContent.trim();
    const foto = meal.querySelector(fotoSelector)?.getAttribute("src") || "";
    const preis = meal.querySelector(preisSelector)?.textContent.trim() || "leer";
    const vegan = !!meal.querySelector(`.${veganIconClass}`);
    const co2Elements = Array.from(meal.querySelectorAll(co2Selector)).map((el) => el.textContent.trim());
    const co2 = co2Elements.join(" - ");

    return { name, foto, preis, vegan, co2 };
  });

  // Verarbeite die Daten und gib sie als Ergebnis zurück
  let result = `Empfehlungen für ${getWeekdayName(weekday)}, den ${date}:\n`;
  result += "-------------------------------------------\n";
  result += meals.map((meal) => `${meal.name} - Preis: ${meal.preis}, Vegan: ${meal.vegan}, CO2: ${meal.co2}`).join("\n");
  return result;
}

// Funktion, um den Wochentagnamen zu erhalten
function getWeekdayName(weekday) {
  const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  return weekdays[weekday];
}

// Funktion, um das Datum des aktuellen Montags zu erhalten
function getMondayDate() {
  const now = new Date();
  const diff = (now.getDay() + 6) % 7;
  const monday = new Date(now.setDate(now.getDate() - diff));
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const day = String(monday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Funktion, um das Datum des nächsten Montags zu erhalten
function getNextMondayDate() {
  const now = new Date();
  const diff = (now.getDay() + 8) % 7;
  const monday = new Date(now.setDate(now.getDate() + diff));
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const day = String(monday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}