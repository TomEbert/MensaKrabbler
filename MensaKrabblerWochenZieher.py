import datetime
import MensaKrabbler
import os

# Führe die MensaKrabbler.run-Funktion für jeden Wochentag der aktuellen Woche (Montag bis Freitag) aus und speichere das Ergebnis in einer Liste
# speisen_recommendation_strings = [MensaKrabbler.run(weekday, False) for weekday in MensaKrabbler.Weekday.weekdays]
speisen_recommendation_dataframes = [MensaKrabbler.run(weekday, True) for weekday in MensaKrabbler.Weekday.weekdays]

# # Erstelle einen JavaScript-Code für jede Woche basierend auf den Werten in speisen_recommendation_strings
# javascript_code = """
# monday_string = `{}`;
# tuesday_string = `{}`;
# wednesday_string = `{}`;
# thursday_string = `{}`;
# friday_string = `{}`;
# """.format(*speisen_recommendation_strings)

# # Pfade zur JavaScript-Datei
# javascript_file_path = 'mensa_krabbler_woche.js'

# # Überprüfe, ob die JavaScript-Datei existiert und erstelle sie andernfalls
# if not os.path.isfile(javascript_file_path):
#     with open(javascript_file_path, 'w') as javascript_file:
#         javascript_file.write(javascript_code)

# # Lese den Inhalt der JavaScript-Datei
# with open(javascript_file_path, 'r') as javascript_file:
#     existing_code = javascript_file.read()

# # Ersetze den Inhalt der Variablen mit den aktualisierten Werten
# updated_code = existing_code + '\n' + javascript_code

# updated_code_formatted = ''

# for line in updated_code.splitlines():
#         if len(line) > 0:
#             if line[-1].isalnum():
#                 line += "\\"
#         updated_code_formatted += line + "\n"

# # Schreibe den aktualisierten Code in die JavaScript-Datei
# with open(javascript_file_path, 'w') as javascript_file:
#     javascript_file.write(updated_code_formatted)

# # Speicher die JavaScript-Datei
# os.system('git add {}'.format(javascript_file_path))
# os.system('git commit -m "Update {}{}"'.format(javascript_file_path, datetime.datetime.now().strftime(" %Y-%m-%d %H:%M:%S")))
# os.system('git push')







# SECOND TRY






# table_rows = ""

# for recommendation in speisen_recommendation_strings:
#     table_rows += "<tr><td>" + recommendation.replace("\n", "</td></tr><tr><td>") + "</td></tr>"

# html_code = f"""
#     <h1
#     style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 50px; color: #ffffff; background-color: #000000; padding: 20px; margin: 0px;"
#     >Der Mensa Krabbler
# </h1>

# <!DOCTYPE html>
# <html>
# <head>
#   <title>Weekdays</title>
#   <style>
#     body {{
#       margin: 0;
#       padding: 0;
#       font-family: Arial, sans-serif;
#     }}
#     #button-frame {{
#       text-align: center;
#       margin-bottom: 10px;
#       margin-top: 10px;
#     }}
#     .weekday-button {{
#       padding: 8px 16px;
#       font-size: 16px;
#       margin-right: 5px;
#     }}
#     #output-text {{
#       width: 100%;
#       min-height: 200px;
#       border: 1px solid #ccc;
#       background-color: #f0f0f0;
#       padding: 5px;
#       box-sizing: border-box;
#     }}
#     #exit-button {{
#       padding: 8px 16px;
#       font-size: 16px;
#     }}
#   </style>
#   <!-- insert the script MensaKrabbler.js -->
#   <script src="mensa_krabbler_woche.js"></script>
# </head>
#     <body>
#     <table>
#         <tr>
#             <th>Empfehlungen</th>
#         </tr>
#         {table_rows}
#     </table>
#     </body>
#     </html>
# """

# with open('recommendations.html', 'w') as html_file:
#     html_file.write(html_code)







# THIRD TRY




import pandas as pd

# Annahme: Du hast bereits die fünf DataFrames für Montag bis Freitag erstellt
# und sie sind in den Variablen monday_df, tuesday_df, wednesday_df, thursday_df und friday_df gespeichert

# Exportiere die DataFrames als separate HTML-Dateien
speisen_recommendation_dataframes[0].to_html('monday_table.html', index=False)
speisen_recommendation_dataframes[1].to_html('tuesday_table.html', index=False)
speisen_recommendation_dataframes[2].to_html('wednesday_table.html', index=False)
speisen_recommendation_dataframes[3].to_html('thursday_table.html', index=False)
speisen_recommendation_dataframes[4].to_html('friday_table.html', index=False)

# Lies den Inhalt der HTML-Dateien ein
with open('monday_table.html', 'r') as f:
    monday_html = f.read()
with open('tuesday_table.html', 'r') as f:
    tuesday_html = f.read()
with open('wednesday_table.html', 'r') as f:
    wednesday_html = f.read()
with open('thursday_table.html', 'r') as f:
    thursday_html = f.read()
with open('friday_table.html', 'r') as f:
    friday_html = f.read()

# Erzeuge den HTML-Code für die kombinierte Seite mit Button-Auswahl
html_template = """
<!DOCTYPE html>
<html>
<head>
  <title>Weekday Tables</title>
  <style>
    .hidden {{
      display: none;
    }}
    body {{
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }}
    #button-frame {{
      text-align: center;
      margin-bottom: 10px;
      margin-top: 10px;
    }}
    .weekday-button {{
      padding: 8px 16px;
      font-size: 16px;
      margin-right: 5px;
    }}
    #output-text {{
      width: 100%;
      min-height: 200px;
      border: 1px solid #ccc;
      background-color: #f0f0f0;
      padding: 5px;
      box-sizing: border-box;
    }}
    #exit-button {{
      padding: 8px 16px;
      font-size: 16px;
    }}
  </style>
</head>
<body>
    <h1
        style="text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 50px; color: #ffffff; background-color: #000000; padding: 20px; margin: 0px;"
        >Der Mensa Krabbler
    </h1>
    <div id="button-frame">
    <button class="weekday-button" onclick="showTable('monday')">Montag</button>
    <button class="weekday-button" onclick="showTable('tuesday')">Dienstag</button>
    <button class="weekday-button" onclick="showTable('wednesday')">Mittwoch</button>
    <button class="weekday-button" onclick="showTable('thursday')">Donnerstag</button>
    <button class="weekday-button" onclick="showTable('friday')">Freitag</button>
  </div>
  <div id="table-container">
    <div id="monday-table" class="hidden">{monday_html}</div>
    <div id="tuesday-table" class="hidden">{tuesday_html}</div>
    <div id="wednesday-table" class="hidden">{wednesday_html}</div>
    <div id="thursday-table" class="hidden">{thursday_html}</div>
    <div id="friday-table" class="hidden">{friday_html}</div>
  </div>
  <script>
    function showTable(weekday) {{
      // Verstecke alle Tabellen
      var tables = document.querySelectorAll("#table-container div");
      tables.forEach(function(table) {{
        table.classList.add("hidden");
      }});

      // Zeige die ausgewählte Tabelle an
      var selectedTable = document.getElementById(weekday + "-table");
      selectedTable.classList.remove("hidden");
    }}
  </script>
</body>
</html>
"""

# Ersetze die Platzhalter im HTML-Template mit den entsprechenden Tabelleninhalten
html_content = html_template.format(
    monday_html=monday_html,
    tuesday_html=tuesday_html,
    wednesday_html=wednesday_html,
    thursday_html=thursday_html,
    friday_html=friday_html
)

# Speichere den kombinierten HTML-Code in einer Datei
with open('index.html', 'w') as f:
    f.write(html_content)

# speichere die HTML-Datei und commite sie in git
os.system('git add index.html')
os.system('git commit -m "Update index.html{}"'.format(datetime.datetime.now().strftime(" %Y-%m-%d %H:%M:%S")))
os.system('git push')