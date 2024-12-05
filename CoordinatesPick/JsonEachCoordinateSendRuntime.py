from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/shortest-distances', methods=['GET'])
def shortest_distances():
    # Get the 'input_name' query parameter from the request
    input_name = request.args.get('input_name', '')

    if not input_name:
        return jsonify({"error": "input_name query parameter is required"}), 400

    # External URL to fetch data
    external_url = f"http://127.0.0.1:8000/shortest-distances/?input_name={input_name}"
    
    try:
        # Send a GET request to the external API
        response = requests.get(external_url)
        response.raise_for_status()  # Ensure we catch any HTTP errors
        
        # Parse the JSON response
        response_json = response.json()

        # Extract the key content from the first item in the shortest_distances list
        shortest_distances = response_json.get('shortest_distances', [])
        
        if not shortest_distances:
            return jsonify({"error": "No shortest distances found in the response"}), 404
        
        # Get the content of the first entry
        key_content = shortest_distances[0].get('content', 'Content not found')

        return jsonify({"key_content": key_content})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
