from flask import Flask, request, jsonify
import requests


"Here takes the name and it gives us the content of longitude and latitiude "
app = Flask(__name__)

@app.route('/shortest-distances', methods=['GET'])
def shortest_distances():
    # Get the 'input_name' query parameter from the request
    input_name = request.args.get('input_name', '')
    
    if not input_name:
        return jsonify({"error": "input_name query parameter is required"}), 400

    # Define the external API URL
    external_url = f"http://127.0.0.1:8000/shortest-distances/?input_name={input_name}"
    
    try:
        # Make the GET request to the external URL
        response = requests.get(external_url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        
        # Extract the JSON content from the response
        response_json = response.json()
        
        # Extract shortest_distances key content
        shortest_distances = response_json.get('shortest_distances', [])
        
        if not shortest_distances:
            return jsonify({"key_content": "No shortest_distances found"}), 404
        
        # Extract specific key content, such as the file and distance of the first item
        key_content = {
            "file": shortest_distances[0].get('file', 'File not found'),
            "distance": shortest_distances[0].get('distance', 'Distance not found'),
            "content": shortest_distances[0].get('content', 'Content not found')
        }
        
        return jsonify({"key_content": key_content})
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
