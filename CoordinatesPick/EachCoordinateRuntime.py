from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Function to find the 4 closest coordinates based on sequential access from key_content
def get_next_coordinates(current_lat, current_lon, all_coords):
    # Find the index of the current point in the key_content list
    current_index = None
    for i, coord in enumerate(all_coords):
        if coord["Latitude"] == current_lat and coord["Longitude"] == current_lon:
            current_index = i
            break
    
    # If current point not found, return error
    if current_index is None:
        return None
    
    # Get the next 4 coordinates starting from the next index
    next_coords = all_coords[current_index + 1: current_index + 5]  # Get the next 4 coordinates
    
    # If there are not enough coordinates after the current point, return only available ones
    return next_coords if len(next_coords) == 4 else next_coords[:4]

@app.route('/shortest-distances', methods=['GET'])
def shortest_distances():
    # Get the 'input_name' query parameter from the request
    input_name = request.args.get('input_name', '')
    base_lat = request.args.get('latitude', type=float)
    base_lon = request.args.get('longitude', type=float)

    if not input_name:
        return jsonify({"error": "input_name query parameter is required"}), 400

    if base_lat is None or base_lon is None:
        return jsonify({"error": "latitude and longitude query parameters are required"}), 400

    # External URL to fetch data
    external_url = f"http://127.0.0.1:8000/shortest-distances/?input_name={input_name}"
    
    try:
        # Send a GET request to the external API
        response = requests.get(external_url)
        response.raise_for_status()  # Ensure we catch any HTTP errors
        
        # Parse the JSON response
        response_json = response.json()

        # Extract the key content from the first item in the response
        key_content = response_json.get('key_content', [])
        
        if not key_content:
            return jsonify({"error": "No key_content found in the response"}), 404
        
        # Find the next 4 coordinates starting from the provided base coordinates
        next_coords = get_next_coordinates(base_lat, base_lon, key_content)
        
        if next_coords is None:
            return jsonify({"error": "Current coordinates not found in the key_content"}), 400
        
        # Construct a new JSON response
        result_json = {
            "base_coordinates": {"Latitude": base_lat, "Longitude": base_lon},
            "next_coordinates": next_coords
        }
        
        return jsonify(result_json)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
