

import csv
import json

# Files
json_file = "singles.json"
csv_files = ["csv/atp_matches_2023.csv", "csv/atp_matches_2024.csv"]

# ✅ Fields we want to keep from CSV
keep_fields = [
    "tourney_id", "tourney_name", "surface", "draw_size", "tourney_level",
    "tourney_date", "winner_id", "winner_seed", "winner_name", 
    "loser_id", "loser_name", "score", "best_of", "round", "minutes"
]

# ✅ Load and filter JSON
with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Keep only entries before 2023
filtered_data = [entry for entry in data if entry["tourney_date"] < "20230101"]

# ✅ Load CSVs and convert to simplified match objects
new_entries = []

for csv_file in csv_files:
    with open(csv_file, newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            match = {key: row.get(key, "").strip() for key in keep_fields}
            new_entries.append(match)

# ✅ Combine and save
combined = filtered_data + new_entries

with open(json_file, "w", encoding="utf-8") as f:
    json.dump(combined, f, indent=4)

print(f"Removed 2023+ entries, added {len(new_entries)} from CSVs. Final count: {len(combined)}")
quit()


# File path
json_file = "rankings.json"

# Load the JSON data
with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Remove "points" key from each entry
for entry in data:
    entry.pop("points", None)  # avoids KeyError if "points" is missing

# Write the modified data back
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4)

print(f"Removed 'points' from {len(data)} entries in {json_file}.")
quit()

# Input files
json_file = "rankings.json"
csv_files = ["csv/atp_rankings_20s.csv", "csv/atp_rankings_current.csv"]

# Step 1: Load existing JSON
with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Step 2: Remove entries with ranking_date >= 20200101
filtered_data = [entry for entry in data if entry["ranking_date"] < "20200101"]

# Step 3: Load all CSV entries
new_entries = []
for csv_file in csv_files:
    with open(csv_file, newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Ensure all values are strings and clean
            cleaned_row = {key: value.strip() for key, value in row.items()}
            new_entries.append(cleaned_row)

# Step 4: Combine and write back
combined = filtered_data + new_entries

with open(json_file, "w", encoding="utf-8") as f:
    json.dump(combined, f, indent=4)

print(f"Filtered to {len(filtered_data)} old entries and added {len(new_entries)} new entries.")
quit()

input_csv = "csv/atp_players.csv"
output_json = "players.json"

# Read the CSV and convert to list of dicts
with open(input_csv, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    data = [row for row in reader]

# Optionally, ensure all values are strings and remove extra spaces
for row in data:
    for key in row:
        if row[key] is not None:
            row[key] = row[key].strip()

# Write to JSON
with open(output_json, 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, indent=4)

print(f"Converted {len(data)} players to JSON and saved to {output_json}.")
quit()

json_list = []


csv_files = ["csv/atp_matches_" + str(x) + ".csv" for x in range(1968, 2024)]

for csv_file in csv_files:
    with open(csv_file) as f:
        csv_reader = csv.DictReader(f)

        for row in csv_reader:
            # Make a copy of the row
            row_copy = row.copy()

            # Delete unwanted keys

            del row_copy["match_num"]

            del row_copy["winner_entry"]

            del row_copy["winner_hand"]
            del row_copy["winner_ht"]
            del row_copy["winner_ioc"]
            del row_copy["winner_age"]

            del row_copy["loser_seed"]
            del row_copy["loser_entry"]

            del row_copy["loser_hand"]
            del row_copy["loser_ht"]
            del row_copy["loser_ioc"]
            del row_copy["loser_age"]

            del row_copy["w_ace"]
            del row_copy["w_df"]
            del row_copy["w_svpt"]
            del row_copy["w_1stIn"]
            del row_copy["w_1stWon"]
            del row_copy["w_2ndWon"]
            del row_copy["w_SvGms"]
            del row_copy["w_bpSaved"]
            del row_copy["w_bpFaced"]
            del row_copy["l_ace"]
            del row_copy["l_df"]
            del row_copy["l_svpt"]
            del row_copy["l_1stIn"]
            del row_copy["l_1stWon"]
            del row_copy["l_2ndWon"]
            del row_copy["l_SvGms"]
            del row_copy["l_bpSaved"]
            del row_copy["l_bpFaced"]
            del row_copy["winner_rank"]
            del row_copy["winner_rank_points"]
            del row_copy["loser_rank"]
            del row_copy["loser_rank_points"]

            # Append modified row
            json_list.append(row_copy)

with open("singles.json", "w") as f:
    f.write(json.dumps(json_list, indent=4))
