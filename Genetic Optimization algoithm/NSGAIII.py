import numpy as np

# Define the constants
WIND_SPEED_THRESHOLD = 15  # Wind speed threshold (in knots)
WAVE_HEIGHT_THRESHOLD = 2  # Wave height threshold (in meters)
COMFORT_DECREASE_RATE = 10  # Rate of comfort decrease due to wave height and wind speed

# Sample data: [distance, wave height, wind speed] for fixed distance 111 km
coordinates_data = np.array([
    [111, 3, 20],  # Coordinate 1: distance = 111 km, wave height = 3 meters, wind speed = 20 knots
    [111, 2, 10],  # Coordinate 2: distance = 111 km, wave height = 2 meters, wind speed = 10 knots
    [111, 4, 25],  # Coordinate 3: distance = 111 km, wave height = 4 meters, wind speed = 25 knots
    [111, 1, 5],   # Coordinate 4: distance = 111 km, wave height = 1 meter, wind speed = 5 knots
    [111, 3, 15]   # Coordinate 5: distance = 111 km, wave height = 3 meters, wind speed = 15 knots
])

# Objective 1: Fuel Consumption
def fuel_consumption(distance, wave_height, wind_speed):
    wind_resistance = max(0, (wind_speed - WIND_SPEED_THRESHOLD) * 0.05)
    wave_resistance = max(0, (wave_height - WAVE_HEIGHT_THRESHOLD) * 0.1)
    fuel = distance * (1 + wind_resistance + wave_resistance)
    return fuel

# Objective 2: Travel Time
def travel_time(distance, wind_speed):
    wind_effect = 1 - max(0, (wind_speed - WIND_SPEED_THRESHOLD) * 0.05)
    time = distance / (20 * wind_effect)
    return time

# Objective 3: Passenger Comfort
def passenger_comfort(wave_height, wind_speed):
    comfort = 100 - (wave_height * COMFORT_DECREASE_RATE + wind_speed * COMFORT_DECREASE_RATE)
    comfort = max(0, comfort)
    return comfort

# Calculate the fitness for each coordinate
coordinates_with_fitness = []
for coord in coordinates_data:
    distance, wave_height, wind_speed = coord
    fuel = fuel_consumption(distance, wave_height, wind_speed)
    time = travel_time(distance, wind_speed)
    comfort = passenger_comfort(wave_height, wind_speed)
    
    # Append the coordinates with their fitness values
    coordinates_with_fitness.append((coord, fuel, time, comfort))

# Sort the coordinates based on fuel (minimize), time (minimize), and comfort (maximize)
sorted_coordinates = sorted(coordinates_with_fitness, key=lambda x: (x[1], x[2], -x[3]))

# Print the sorted coordinates from most optimal to least optimal
print("Sorted coordinates based on most optimal to least optimal:")
for coord, fuel, time, comfort in sorted_coordinates:
    print(f"Distance: {coord[0]} km | Wave Height: {coord[1]} meters | Wind Speed: {coord[2]} knots | "
          f"Fuel: {fuel:.2f} | Time: {time:.2f} hours | Comfort: {comfort:.2f}")