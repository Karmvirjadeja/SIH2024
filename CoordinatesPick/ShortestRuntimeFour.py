from flask import Flask, request, jsonify
import os
import json
import math

app = Flask(__name__)

def nextFour(lat, lon, file_name, folder_name):
    """
    Find the given latitude and longitude in the specified JSON file and return the next four coordinates.
    """
    # Get the full path to the file
    current_dir = os.path.dirname(__file__)  # Current script directory
    file_path = os.path.join(current_dir, folder_name, file_name)

    # Check if the file exists
    if not os.path.exists(file_path):
        return {"error": f"File {file_name} not found in the folder {folder_name}."}, []

    # Read and parse the JSON file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # Ensure the data is a list
    if not isinstance(data, list):
        return {"error": "Invalid JSON format: Expected a list of points."}, []

    # Iterate through the data to find the matching coordinate
    for index, point in enumerate(data):
        if point.get("Latitude") == lat and point.get("Longitude") == lon:
            # Return the next four points if available
            return None, data[index + 1:index + 5]
    
    # Return an error if the coordinate is not found
    return {"error": "Coordinate not found in the file."}, []

def points_with_intermediates(lat1, lon1, lat2, lon2):
    """
    Calculate three intermediate points and include the source and destination coordinates.
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

@app.route('/api/coordinates', methods=['GET'])
def get_coordinates():
    """
    API endpoint to get the next four coordinates and intermediate points.
    """
    try:
        # Parse input parameters from the request
        lat = float(request.args.get('latitude'))
        lon = float(request.args.get('longitude'))
        file_name = request.args.get('file_name')
        folder_name = request.args.get('folder_name')

        # Get the next four coordinates
        error, next_coords = nextFour(lat, lon, file_name, folder_name)
        if error:
            return jsonify(error), 400

        # Ensure we have at least two points for calculating intermediate points
        if len(next_coords) < 2:
            return jsonify({"error": "Insufficient next coordinates to calculate intermediates."}), 400

        # Extract the first two coordinates from next_four_coordinates
        lat1, lon1 = next_coords[0]["Latitude"], next_coords[0]["Longitude"]
        lat2, lon2 = next_coords[1]["Latitude"], next_coords[1]["Longitude"]

        # Calculate intermediate points
        intermediate_points = points_with_intermediates(lat1, lon1, lat2, lon2)

        # Combine results into a response
        response = {
            "next_four_coordinates": next_coords,
            "intermediate_points": intermediate_points
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
