from fastapi import FastAPI, HTTPException, Query
from typing import List, Dict
import os
import json
import math
import re

app = FastAPI()


#http://127.0.0.1:8000/shortest-distances/?input_name=chennai-perth

#uvicorn Jsondistance:app --reload






def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth.
    """
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_total_distance(json_file):
    """
    Calculate the total distance passing through all the points in the JSON file.
    """
    with open(json_file, 'r') as file:
        data = json.load(file)
    total_distance = 0
    # Ensure the file data is in the expected format
    if isinstance(data, list):
        for i in range(len(data) - 1):
            lat1, lon1 = data[i].get("Latitude"), data[i].get("Longitude")
            lat2, lon2 = data[i + 1].get("Latitude"), data[i + 1].get("Longitude")
            if None not in [lat1, lon1, lat2, lon2]:
                total_distance += haversine(lat1, lon1, lat2, lon2)
    else:
        raise ValueError("JSON file content is not a list of points.")
    return total_distance

def filter_and_calculate_distance(folder_path, input_name):
    """
    Filter JSON files by name pattern and calculate the distance for valid files.
    """
    pattern = re.compile(f"^{input_name}\\d+\\.json")
    results = []
    for file_name in os.listdir(folder_path):
        file_name = file_name.strip()  # Remove unwanted spaces or newline characters
        print(f"Checking file: {file_name}")  # Debugging: print file names
        if pattern.match(file_name):  # Check if file name matches the pattern
            file_path = os.path.join(folder_path, file_name)
            try:
                with open(file_path, 'r') as file:
                    file_content = json.load(file)
                total_distance = calculate_total_distance(file_path)
                results.append({"file": file_name, "distance": total_distance, "content": file_content})
            except (json.JSONDecodeError, ValueError) as e:
                print(f"Error reading {file_name}: {e}")
                continue
    return results

@app.get("/shortest-distances/")
def get_shortest_distances(input_name: str = Query(..., description="Base name of the files to search, e.g., 'chennai-perth'")):
    """
    Endpoint to get the three JSON files with the shortest distances.
    """
    current_dir = os.path.dirname(__file__)  # Current script directory
    folder_path = os.path.join(current_dir, "chennai-perth")  # Path to data folder
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Folder not found.")
    
    results = filter_and_calculate_distance(folder_path, input_name)
    
    if not results:
        raise HTTPException(status_code=404, detail=f"No files matching the pattern '{input_name}<number>.json' were found.")
    
    # Sort results by distance and return the top three
    
    return {"shortest_distances": results}

