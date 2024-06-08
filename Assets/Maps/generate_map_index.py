# Made by Aurora 
# need a json that just tells me where all those files are 

# json struct
# [{info: pathtojson, csv: pathtocsv}]
import json
import csv
import io
from os import listdir
from os.path import isfile, join
import urllib.parse


def create_map_dictionary(path):
    maps = []
    folders = [files for files in listdir(path) if not isfile(join(path, files))]
    folder_amount = len(folders)
    folder_counter = 1
    folder_len = len(str(folder_amount))
    count_missing = 0
    for folder in folders:
        print(f"Creating object for map {str(folder_counter).zfill(folder_len)}/{folder_amount}",end="\r")
        folder_counter += 1
        map_obj = {"name":"","map_data":"","csv_data":""}

        files = [file for file in listdir(join(path, folder)) if isfile(join(path, folder, file))]
        
        if not f"{folder}.json" in files or not f"{folder}.csv" in files:
            print(" "*50, "---- WARNING ----", sep="\r")
            print(f"Folder {folder} does not have all required files ({folder}.json and {folder}.csv)!")
            print("Skipping...")
            count_missing += 1
        else:
            map_obj["name"] = folder
            for file in files:
                if file.endswith(".csv"):
                    with open(join(path, folder, file), "r") as csv_file:
                        csv_reader = csv.reader(csv_file, delimiter=',')
                        map_obj["csv_data"] = [row for row in csv_reader]
                if file.endswith(".json"):
                    with open(join(path, folder, file), "r") as json_file:
                        map_obj["map_data"] = json.load(json_file)

            maps.append(map_obj)
    print("")
    print("Folders with missing files: "+str(count_missing))
    return maps


def write_to_file(path, obj):
    json_object = json.dumps(obj, indent=4)
    with open(path, "w") as outfile:
        outfile.write(json_object)


if __name__ == "__main__":
    dir = "."
    print("Welcome to files to json thingymajig 2 by Aurora!")
    print("Generating object from files in " + dir )
    obj = create_map_dictionary(dir)
    print("Writing to file...")
    write_to_file("map_index.json", obj)
    print("Done!")
    print()
