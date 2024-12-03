import json
import os
import requests


# Input is Latitude and Longitude json
#Output is a Descriptor json corresponding input files 
def convert_to_dms(degrees):
    is_negative = degrees < 0
    degrees = abs(degrees)
    d = int(degrees)
    m = int((degrees - d) * 60)
    s = (degrees - d - m / 60) * 3600
    direction = 'S' if is_negative else 'N'
    if degrees < 0:
        direction = 'W' if degrees < 0 else 'E'
    return f"{d}°{m}'{round(s)}\"{direction}"

def get_landmark_from_coordinates(lat, lon, api_key):
    url = f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key=503dc7f91e5e442893c429bd6092e0aa"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            return data['results'][0]['formatted']
    return "Unknown Landmark"

def create_descriptor(input_json_path, output_json_path, api_key):
    try:
        with open(input_json_path, 'r') as file:
            data = json.load(file)
            print("Input JSON file successfully loaded.")
    except FileNotFoundError:
        print(f"File not found: {input_json_path}")
        return
    except json.JSONDecodeError as e:
        print(f"Invalid JSON format: {e}")
        return
    
    descriptor = []

    for point in data:
        latitude = point['Latitude']
        longitude = point['Longitude']
        latitude_dms = convert_to_dms(latitude)
        longitude_dms = convert_to_dms(longitude)
        
        landmark = get_landmark_from_coordinates(latitude, longitude, api_key)
        
        descriptor.append({
            "Latitude": latitude,
            "Longitude": longitude,
            "Latitude_DMS": latitude_dms,
            "Longitude_DMS": longitude_dms,
            "Landmark": landmark
        })
    
    try:
        with open(output_json_path, 'w') as output_file:
            json.dump(descriptor, output_file, indent=4)
        print(f"Descriptor JSON file saved successfully as {output_json_path}")
    except Exception as e:
        print(f"Error saving descriptor file: {e}")

if __name__ == "__main__":
    input_json_path = os.path.join('chennai-perth', 'path1.json')
    output_json_path = 'descriptor.json'
    api_key = 'YOUR_OPENCAGE_API_KEY'  # Replace with your OpenCage API key
    create_descriptor(input_json_path, output_json_path, api_key)
