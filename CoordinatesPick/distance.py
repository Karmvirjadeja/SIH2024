import json
import math
import os

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth.
    Args:
    - lat1, lon1: Latitude and longitude of point 1 in decimal degrees.
    - lat2, lon2: Latitude and longitude of point 2 in decimal degrees.
    Returns:
    - Distance in kilometers.
    """
    R = 6371  # Earth's radius in km

    # Convert degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Differences in coordinates
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_total_distance(json_file):
    """
    Calculate the total distance passing through all the points in the JSON file.
    Args:
    - json_file: Path to the JSON file containing coordinates.
    Returns:
    - Total distance in kilometers.
    """
    with open(json_file, 'r') as file:
        data = json.load(file)

    total_distance = 0
    points = data

    for i in range(len(points) - 1):
        lat1, lon1 = points[i]["Latitude"], points[i]["Longitude"]
        lat2, lon2 = points[i + 1]["Latitude"], points[i + 1]["Longitude"]
        total_distance += haversine(lat1, lon1, lat2, lon2)

    return total_distance

def find_shortest_distance(folder_path):
    """
    Find the JSON file with the shortest total distance.
    Args:
    - folder_path: Path to the folder containing JSON files.
    Returns:
    - Name of the JSON file with the shortest distance and its distance.
    """
    shortest_distance = float('inf')
    shortest_file = None

    for file_name in os.listdir(folder_path):
        if file_name.endswith('.json'):  # Process only JSON files
            file_path = os.path.join(folder_path, file_name)
            total_distance = calculate_total_distance(file_path)
            print(f"File: {file_name}, Distance: {total_distance:.2f} km")
            
            if total_distance < shortest_distance:
                shortest_distance = total_distance
                shortest_file = file_name

    return shortest_file, shortest_distance

# Get the folder path dynamically
current_dir = os.path.dirname(__file__)  # Directory of the current script
folder_path = os.path.join(current_dir, "chennai-perth")

# Find and print the JSON file with the shortest distance
shortest_file, shortest_distance = find_shortest_distance(folder_path)
print(f"\nShortest distance is in file: {shortest_file} with a distance of {shortest_distance:.2f} km")
