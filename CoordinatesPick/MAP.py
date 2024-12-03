from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# File path for storing the coordinates
coordinates_file = 'coordinates.json'

# Check if the file exists, if not, create an empty one
if not os.path.exists(coordinates_file):
    with open(coordinates_file, 'w') as f:
        json.dump([], f)

@app.route('/save-coordinates', methods=['POST'])
def save_coordinates():
    try:
        # Get the coordinates from the request
        data = request.get_json()
        coordinates = data.get('coordinates', [])

        # Load existing coordinates from the file
        with open(coordinates_file, 'r') as f:
            existing_coordinates = json.load(f)

        # Append new coordinates to the existing ones
        existing_coordinates.extend(coordinates)

        # Save the updated coordinates back to the file
        with open(coordinates_file, 'w') as f:
            json.dump(existing_coordinates, f)

        return jsonify({"status": "success", "message": "Coordinates saved successfully."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
