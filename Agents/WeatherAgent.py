import json
import requests
import time  # Import time module for sleep

class WeatherAnalysisAgent:
    def __init__(self, api_url):
        self.api_url = api_url  # Your API endpoint

    def get_weather_data(self, lat, lon):
        """
        Fetch weather data from your API for a given latitude and longitude using a POST request.
        """
        # Prepare the request body with location coordinates
        body = {
            "latitude": lat,
            "longitude": lon
        }
        
        # Make the POST API request with a body
        try:
            # Using the `requests` library, send the body with a POST request
            response = requests.post(self.api_url, json=body)  # Using 'json' instead of 'params'
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            # Check if the response status is 200
            if response.status_code == 200:
                data = response.json()
                
                # Print the entire response for debugging
                print("API Response:", json.dumps(data, indent=2))  # Pretty print the response

                # Ensure 'data' exists and has the relevant keys
                if 'data' in data:
                    weather_data = data['data']
                    
                    # Extract relevant weather information from the response
                    wind_speed = weather_data['hourly'].get('windSpeed180m', 'N/A')
                    wind_direction = weather_data['hourly'].get('windDirection180m', 'N/A')
                    
                    # Correctly accessing the marine data
                    if 'marine' in weather_data:
                        wave_height = weather_data['marine']['hourly'].get('waveHeight', 'N/A')
                        wave_direction = weather_data['marine']['hourly'].get('waveDirection', 'N/A')
                    else:
                        wave_height = 'N/A'
                        wave_direction = 'N/A'
                    
                    # Create the weather dictionary
                    weather = {
                        'wind_speed': wind_speed,
                        'wind_direction': wind_direction,
                        'wave_height': wave_height,
                        'wave_direction': wave_direction,
                        'current_speed': 0  # Placeholder if current speed is not available
                    }
                    return weather
                else:
                    print("Error: 'data' not found in API response.")
                    return None
            else:
                print(f"Error fetching weather data: {response.status_code}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def forecast_weather(self, waypoints, output_file='weather_data.json'):
        """
        Forecast the weather for all waypoints in the route, one by one with a 5-second delay between requests.
        Save the result in a JSON file.
        """
        weather_data = []  # List to store weather data for all waypoints
        for i, waypoint in enumerate(waypoints):
            lat = waypoint['Latitude']
            lon = waypoint['Longitude']
            print(f"Fetching weather data for Waypoint {i + 1} (Latitude: {lat}, Longitude: {lon})")
            weather = self.get_weather_data(lat, lon)  # Get weather for this waypoint
            if weather:
                weather_data.append(weather)  # Add to results if successful
            else:
                print(f"Failed to fetch weather data for Waypoint {i + 1}")
            
            # Add a delay of 5 seconds between each request
            time.sleep(5)  # Pause for 5 seconds
        
        # Save weather data to a JSON file after all waypoints are processed
        with open(output_file, 'w') as file:
            json.dump(weather_data, file, indent=2)
        
        # Return the weather data
        return weather_data

# Read waypoints from chennai-perth2.json
def read_waypoints_from_json(file_path):
    with open(file_path, 'r') as file:
        waypoints = json.load(file)
    return waypoints

# Replace with your actual API URL
api_url = 'http://localhost:8000/api/data'

# Initialize the Weather Analysis Agent
weather_agent = WeatherAnalysisAgent(api_url)

# Read waypoints from chennai-perth2.json
waypoints = read_waypoints_from_json('chennai-perth2.json')

# Get weather forecast for the route (Chennai to Perth)
weather_data = weather_agent.forecast_weather(waypoints)

# Print weather data for each waypoint after all are processed
print("\nAll Waypoints Weather Data:")
for i, data in enumerate(weather_data):
    print(f"Waypoint {i + 1}: {data}")
