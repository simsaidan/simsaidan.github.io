import csv
import json

json_list = []


csv_files = ["csv/atp_matches_doubles_" + str(x) + ".csv" for x in range(2000, 2021)]

for csv_file in csv_files:
    with open(csv_file) as f:
        csv_reader = csv.DictReader(f)

        for row in csv_reader:
            # Make a copy of the row
            row_copy = row.copy()

            # Delete unwanted keys

            del row_copy["match_num"]

            del row_copy["winner_seed"]
            del row_copy["winner_entry"]

            del row_copy["loser_seed"]
            del row_copy["loser_entry"]

            del row_copy["winner1_hand"]
            del row_copy["winner1_ht"]
            del row_copy["winner1_ioc"]
            del row_copy["winner1_age"]

            del row_copy["winner2_hand"]
            del row_copy["winner2_ht"]
            del row_copy["winner2_ioc"]
            del row_copy["winner2_age"]

            del row_copy["loser1_hand"]
            del row_copy["loser1_ht"]
            del row_copy["loser1_ioc"]
            del row_copy["loser1_age"]

            del row_copy["loser2_hand"]
            del row_copy["loser2_ht"]
            del row_copy["loser2_ioc"]
            del row_copy["loser2_age"]
            del row_copy["winner1_rank"]
            del row_copy["winner1_rank_points"]
            del row_copy["winner2_rank"]
            del row_copy["winner2_rank_points"]
            del row_copy["loser1_rank"]
            del row_copy["loser1_rank_points"]
            del row_copy["loser2_rank"]
            del row_copy["loser2_rank_points"]

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

            # Append modified row
            json_list.append(row_copy)

with open("doubles.json", "w") as f:
    f.write(json.dumps(json_list, indent=4))
