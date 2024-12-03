import math
import heapq
import json
import random  # Import random module to choose coordinates randomly

# Haversine formula to calculate the distance between two coordinates
def to_rad(degrees):
    return degrees * math.pi / 180

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers
    dLat = to_rad(lat2 - lat1)
    dLon = to_rad(lon2 - lon1)
    a = math.sin(dLat / 2) * math.sin(dLat / 2) + \
        math.cos(to_rad(lat1)) * math.cos(to_rad(lat2)) * \
        math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c  # Distance in kilometers
    return distance

# Dijkstra's Algorithm to find the shortest path between source and destination coordinates
def dijkstra(coordinates, start_idx, end_idx):
    num_nodes = len(coordinates)
    distances = [float('inf')] * num_nodes
    previous = [None] * num_nodes
    visited = [False] * num_nodes
    queue = []
    
    distances[start_idx] = 0
    heapq.heappush(queue, (0, start_idx))
    
    while queue:
        current_dist, current_idx = heapq.heappop(queue)
        
        if visited[current_idx]:
            continue
        visited[current_idx] = True
        
        # If we reached the destination
        if current_idx == end_idx:
            path = []
            current = current_idx
            while current is not None:
                path.insert(0, coordinates[current])
                current = previous[current]
            return path  # Return the shortest path
        
        # Calculate distances from current node to others
        for i in range(num_nodes):
            if i == current_idx or visited[i]:
                continue
            distance = haversine(
                coordinates[current_idx][0], coordinates[current_idx][1],
                coordinates[i][0], coordinates[i][1]
            )
            new_dist = current_dist + distance
            if new_dist < distances[i]:
                distances[i] = new_dist
                previous[i] = current_idx
                heapq.heappush(queue, (new_dist, i))
    
    return []  # If no path exists

# Read coordinates from coordinates.json file
def read_coordinates_from_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
        # Convert to list of tuples (Latitude, Longitude)
        coordinates = [(entry['Latitude'], entry['Longitude']) for entry in data]
    return coordinates

# Function to compare two coordinates with tolerance (to avoid floating-point precision issues)
def compare_coordinates(coord1, coord2, tolerance=1e-6):
    return abs(coord1[0] - coord2[0]) < tolerance and abs(coord1[1] - coord2[1]) < tolerance

# Find the index of a coordinate in the list with tolerance
def find_coordinate_index(coordinate, coordinates):
    for idx, coord in enumerate(coordinates):
        if compare_coordinates(coord, coordinate):
            return idx
    return None

# Example Usage
coordinates = read_coordinates_from_json('coordinates.json')

# Randomly select source and destination from the coordinates list
source = random.choice(coordinates)
destination = random.choice(coordinates)

# Ensure source and destination are different
while compare_coordinates(source, destination):
    destination = random.choice(coordinates)

# Find the indices of the source and destination coordinates
start_idx = find_coordinate_index(source, coordinates)
end_idx = find_coordinate_index(destination, coordinates)

if start_idx is None or end_idx is None:
    print("Source or destination not found in the coordinates list.")
else:
    # Find the shortest path from source to destination
    shortest_path = dijkstra(coordinates, start_idx, end_idx)
    print(f"Source: {source}")
    print(f"Destination: {destination}")
    print("Shortest path:", shortest_path)
