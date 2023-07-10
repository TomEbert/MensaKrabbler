// Crawlt die Website und speichert den Namen jedes <div>-Elements
fetch("https://sws2.maxmanager.xyz")
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const divElements = doc.querySelectorAll("div");
    
    // Speichert den Namen jedes <div>-Elements
    const divNames = Array.from(divElements).map((div) => div.getAttribute("name"));
    
    // Zeigt die Namen der <div>-Elements an
    console.log(divNames);
  })
  .catch((error) => {
    console.log("Ein Fehler ist aufgetreten:", error);
  });
