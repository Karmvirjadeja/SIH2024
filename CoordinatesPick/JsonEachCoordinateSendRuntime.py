import json
import os

def process_coordinates(data):
    """
    Process the latitude and longitude points.
    Assumes data is a list of dictionaries with 'Latitude' and 'Longitude' keys.
    """
    if not isinstance(data, list):
        raise ValueError("JSON structure must be a list of coordinate objects.")
    
    for point in data:
        if 'Latitude' not in point or 'Longitude' not in point:
            raise ValueError("Each coordinate object must have 'Latitude' and 'Longitude' keys.")
        
        latitude = point['Latitude']
        longitude = point['Longitude']
        print(f"Processing point: Latitude = {latitude}, Longitude = {longitude}")
    
    return len(data)


if __name__ == "__main__":
    # Define the path to the JSON file
    json_file_path = os.path.join('chennai-perth', 'path1.json')  # Adjust the path as needed
    
    try:
        # Open and read the JSON file
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            print("JSON file successfully loaded.")
    except FileNotFoundError:
        print(f"File not found: {json_file_path}")
        exit(1)
    except json.JSONDecodeError as e:
        print(f"Invalid JSON format: {e}")
        exit(1)
    
    try:
        # Process the data
        count = process_coordinates(data)
        print(f"Processed {count} coordinate points.")
    except ValueError as e:
        print(f"Error processing coordinates: {e}")
