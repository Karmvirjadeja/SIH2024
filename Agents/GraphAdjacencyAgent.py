import json
from math import radians, sin, cos, sqrt, atan2

# Haversine formula to calculate the distance between two lat/long coordinates
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

# Convert coordinates JSON to adjacency list
def coordinates_to_graph(data):
    graph = {}
    num_points = len(data)
    
    for i in range(num_points):
        lat1, lon1 = data[i]["Latitude"], data[i]["Longitude"]
        point1 = f"Point-{i+1}"
        graph[point1] = {}
        
        # Loop only over points with indices greater than the current one
        for j in range(i + 1, num_points):
            lat2, lon2 = data[j]["Latitude"], data[j]["Longitude"]
            point2 = f"Point-{j+1}"
            distance = haversine_distance(lat1, lon1, lat2, lon2)
            graph[point1][point2] = round(distance, 2)
    
    return graph

# Load coordinates from JSON file and convert to graph
def main(input_file, output_file):
    try:
        with open(input_file, 'r') as file:
            data = json.load(file)
        
        if not isinstance(data, list):
            raise ValueError("Input JSON must be a list of coordinate dictionaries.")
        
        graph = coordinates_to_graph(data)
        
        # Save the adjacency list to a new file
        with open(output_file, 'w') as outfile:
            json.dump(graph, outfile, indent=4)
        
        print(f"Adjacency list saved to {output_file}")
    except Exception as e:
        print(f"Error: {e}")

# Call the main function with your JSON file
main("chennai-perth2.json", "adjacency_list.json")
