import os
import json

def nextFour(lat, lon, file_name):
    """
    Find the given latitude and longitude in the specified JSON file and return the next four coordinates.
    
    Parameters:
        lat (float): Latitude of the starting point.
        lon (float): Longitude of the starting point.
        file_name (str): Name of the JSON file to read.

    Returns:
        list: The next four coordinates from the specified file.
    """
    # Define the folder name
    folder_name = "chennai-perth"

    # Get the full path to the file
    current_dir = os.path.dirname(__file__)  # Current script directory
    file_path = os.path.join(current_dir, folder_name, file_name)

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"File {file_name} not found in the folder {folder_name}.")
        return []

    # Read and parse the JSON file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Ensure the data is a list
    if not isinstance(data, list):
        print("Invalid JSON format: Expected a list of points.")
        return []

    # Iterate through the data to find the matching coordinate
    for index, point in enumerate(data):
        if point.get("Latitude") == lat and point.get("Longitude") == lon:
            # Return the next four points if available
            return data[index + 1:index + 5]
    
    # Return an empty list if the coordinate is not found
    return []


def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth.
    """
    R = 6371  # Earth's radius in km
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def points_with_intermediates(lat1, lon1, lat2, lon2):
    """
    Calculate three intermediate points and include the source and destination coordinates.
    
    Parameters:
        lat1 (float): Latitude of the starting point.
        lon1 (float): Longitude of the starting point.
        lat2 (float): Latitude of the destination point.
        lon2 (float): Longitude of the destination point.
    
    Returns:
        list: A list of five points, including the source, three intermediates, and the destination.
    """
    points = [{"Latitude": lat1, "Longitude": lon1}]  # Include source point
    # Generate three intermediate points by dividing the path into four equal parts
    for i in range(1, 4):  # 1/4, 2/4, 3/4 of the way
        fraction = i / 4
        inter_lat = lat1 + (lat2 - lat1) * fraction
        inter_lon = lon1 + (lon2 - lon1) * fraction
        points.append({"Latitude": inter_lat, "Longitude": inter_lon})
    points.append({"Latitude": lat2, "Longitude": lon2})  # Include destination point
    return points

# Example usage
if __name__ == "__main__":
    # Source and destination coordinates
    source_lat = 12.998536361429462
    source_lon = 80.34301757812501
    dest_lat = 15.0
    dest_lon = 84.0

    # Calculate points including intermediates
    result_points = points_with_intermediates(source_lat, source_lon, dest_lat, dest_lon)

    # Print the results
    print("Points from source to destination:")
    for idx, point in enumerate(result_points, start=1):
        print(f"Point {idx} - Latitude: {point['Latitude']}, Longitude: {point['Longitude']}")
        
        
        
        

# Example usage
if __name__ == "__main__":
    # Input values
    latitude = 12.998536361429462
    longitude = 80.34301757812501
    json_file_name = "chennai-perth2.json"

    # Get the next four coordinates
    next_coordinates = nextFour(latitude, longitude, json_file_name)

    
    # Print the results
    if next_coordinates:
        print("Next four coordinates:")
        for idx, coord in enumerate(next_coordinates, start=1):
            print(f"Point {idx} - Latitude: {coord.get('Latitude')}, Longitude: {coord.get('Longitude')}")
    else:
        print("No next coordinates found.")
        
        
          # Source and destination coordinates
    source_lat = 12.998536361429462
    source_lon = 80.34301757812501
    dest_lat = 15.0
    dest_lon = 84.0

    # Calculate points including intermediates
    result_points = points_with_intermediates(source_lat, source_lon, dest_lat, dest_lon)

    # Print the results
    print("Points from Currentsource to Nearestdestination:")
    for idx, point in enumerate(result_points, start=1):
        print(f"Point {idx} - Latitude: {point['Latitude']}, Longitude: {point['Longitude']}")

