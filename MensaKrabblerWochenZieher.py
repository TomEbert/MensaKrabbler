import datetime
import MensaKrabbler
import os

# Führe die MensaKrabbler.run-Funktion für jeden Wochentag der aktuellen Woche (Montag bis Freitag) aus und speichere das Ergebnis in einer Liste
speisen_recommendation_strings = [MensaKrabbler.run(weekday) for weekday in MensaKrabbler.Weekday.weekdays]

# Erstelle einen JavaScript-Code für jede Woche basierend auf den Werten in speisen_recommendation_strings
javascript_code = """
monday_string = `{}`;
tuesday_string = `{}`;
wednesday_string = `{}`;
thursday_string = `{}`;
friday_string = `{}`;
""".format(*speisen_recommendation_strings)

# Pfade zur JavaScript-Datei
javascript_file_path = 'mensa_krabbler_woche.js'

# Überprüfe, ob die JavaScript-Datei existiert und erstelle sie andernfalls
if not os.path.isfile(javascript_file_path):
    with open(javascript_file_path, 'w') as javascript_file:
        javascript_file.write(javascript_code)

# Lese den Inhalt der JavaScript-Datei
with open(javascript_file_path, 'r') as javascript_file:
    existing_code = javascript_file.read()

# Ersetze den Inhalt der Variablen mit den aktualisierten Werten
updated_code = existing_code + '\n' + javascript_code

updated_code_formatted = ''

for line in updated_code.splitlines():
        if len(line) > 0:
            if line[-1].isalnum():
                line += "\\"
        updated_code_formatted += line + "\n"

# Schreibe den aktualisierten Code in die JavaScript-Datei
with open(javascript_file_path, 'w') as javascript_file:
    javascript_file.write(updated_code_formatted)

# Speicher die JavaScript-Datei
os.system('git add {}'.format(javascript_file_path))
os.system('git commit -m "Update {}{}"'.format(javascript_file_path, datetime.datetime.now().strftime(" %Y-%m-%d %H:%M:%S")))
os.system('git push')