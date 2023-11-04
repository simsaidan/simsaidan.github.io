import csv
import json

with open("atp_players.csv") as csvf:
    csv_reader = csv.DictReader(csvf)

    json_list = []
    for row in csv_reader:
        json_list.append(row)

with open("players.json", "w") as jsonf:
    jsonf.write(json.dumps(json_list, indent=4))
