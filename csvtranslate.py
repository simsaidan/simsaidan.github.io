import csv
import json

json_list = []


csv_files = ["atp_matches_" + str(x) + ".csv" for x in range(1968, 2024)]

for csv_file in csv_files:
    with open(csv_file) as f:
        csv_reader = csv.DictReader(f)

        for row in csv_reader:
            json_list.append(row)

with open("singles.json", "w") as f:
    f.write(json.dumps(json_list, indent=4))
