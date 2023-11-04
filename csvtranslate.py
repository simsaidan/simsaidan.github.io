import csv
import json

json_list = []

csv_files = ["file1.csv", "file2.csv", "file3.csv"]

for csv_file in csv_files:
    with open(csv_file) as f:
        csv_reader = csv.DictReader(f)

        for row in csv_reader:
            json_list.append(row)

with open("rankings.json", "w") as f:
    f.write(json.dumps(json_list, indent=4))
