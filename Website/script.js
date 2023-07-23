// Wird ausgeführt, wenn Website geladen wird
document.addEventListener("DOMContentLoaded", function() {
    startTable();
  });

// Zeigt die Tabelle zum passenden Tag standardmäßig an  
function startTable() {
    // Speicher Tag als Index (1-5), Sonntag und Samstag sollen auch Freitag anzeigen.
    today = new Date();
    dayIndex = today.getDay();
    if(dayIndex == 0 || dayIndex == 6) {
      dayIndex = 5;
    }

    // Highlightet den Knopf zum passenden Tag
    var buttonContainer = document.getElementById("button-frame");
    var button = buttonContainer.getElementsByTagName("button")[dayIndex-1];
    button.classList.add("active");
    activeButtonId = dayIndex;

    // Versteckt alle Tabellen
    var tables = document.querySelectorAll("#table-container div");
    tables.forEach(function(table) {
      table.classList.add("hidden");
    });

    // Beginnt mit Montag = 1, Dienstag = 2, ...
    if(dayIndex == 1) {
      tables[0].classList.remove("hidden");
    }
    if(dayIndex == 2) {
      tables[1].classList.remove("hidden");
    }
    if(dayIndex == 3) {
      tables[2].classList.remove("hidden");
    }
    if(dayIndex == 4) {
      tables[3].classList.remove("hidden");
    }
    if(dayIndex == 5) {
      tables[4].classList.remove("hidden");
    }
  }

// Zeigt nach Knopfdruck passende Tabelle an  
function showTable(weekday) {
// Verstecke alle Tabellen
  var tables = document.querySelectorAll("#table-container div");
  tables.forEach(function(table) {
    table.classList.add("hidden");
  });

  // Zeige die ausgewählte Tabelle an
  var selectedTable = document.getElementById(weekday + "-table");
  selectedTable.classList.remove("hidden");

  // if weekday = monday run activateButton(1) if weekday = tuesday run activateButton(2) ...
  if (weekday === "monday") {
    activateButton(1);
  }
  if (weekday === "tuesday") {
    activateButton(2);
  }
  if (weekday === "wednesday") {
    activateButton(3);
  }
  if (weekday === "thursday") {
    activateButton(4);
  }
  if (weekday === "friday") {
    activateButton(5);
  }
}

var activeButtonId = null;

// Highlighted Knopf von dem Tag der aktiven Tabelle 
function activateButton(buttonId) {
  if (activeButtonId === buttonId) {
    return;
  }

  // Entferne Highlights von allen Knöpfen
  var buttons = document.getElementsByClassName("weekday-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  
  // Highlighte nur den gedrückten Knopf
  var button = buttons[buttonId-1];
  button.classList.add("active");
    
  
  activeButtonId = buttonId;
}

