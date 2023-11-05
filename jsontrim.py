import json

with open("doubles.json") as f:
    data = json.load(f)

for item in data:
    del item["null"]

with open("doubles.json", "w") as f:
    json.dump(data, f, indent=4)
