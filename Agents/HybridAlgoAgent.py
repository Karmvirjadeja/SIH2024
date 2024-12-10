import json
import random
import math

# Load JSON data
def load_json(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        exit(1)

# Load data
waypoints = load_json('chennai-perth2.json')  # Coordinates of waypoints (list of dicts with Latitude and Longitude)
weather_data = load_json('weather_data.json')  # Weather conditions
graph = load_json('adjacency_list.json')  # Graph adjacency list

# ACO Parameters
NUM_ANTS = 200  # 20 - 100
EVAPORATION_RATE = 0.5  # 0-1 
ALPHA = 1  # Pheromone influence 1-3
BETA = 2  # Distance influence 1-5
MAX_ITER = 50  # 50-200

# GA Parameters
POPULATION_SIZE = 50  # 20-50 
CROSSOVER_RATE = 0.8  # 0.7 - 1.0
MUTATION_RATE = 0.1  # 0.2
NUM_GENERATIONS = 50  # 20-100

# Pheromone Initialization
pheromones = {node: {neighbor: 1 for neighbor in graph[node]} for node in graph}

# Calculate optimal wind speed and wave height thresholds
def calculate_thresholds(vessel_type, size, weight, hull_design, monsoon, current_speed, current_direction):
    BASE_WIND_THRESHOLD = 15  # knots
    BASE_WAVE_THRESHOLD = 2  # meters

    VESSEL_FACTORS = {
        "Container Ship": 1.1,
        "Bulk Carrier": 1.2,
        "Cargo Ship": 1.0,
        "Tanker": 1.3,
    }

    vessel_factor = VESSEL_FACTORS.get(vessel_type, 1.0)
    size_factor = math.log(max(size, 1)) / 10
    weight_factor = math.sqrt(max(weight, 1)) / 1000

    hull_design_factors = {
        "streamlined": 1.2,
        "bulbous": 1.1,
        "traditional": 0.9,
        "optimized": 1.3
    }

    hull_factor = hull_design_factors.get(hull_design.lower(), 1.0)

    MONSOON_FACTORS = {
        "Northeast": {"wind": -1, "wave": 0.2},
        "Southwest": {"wind": -3, "wave": 0.5},
        "None": {"wind": 0, "wave": 0},
    }
    monsoon_adjustment = MONSOON_FACTORS.get(monsoon, {"wind": 0, "wave": 0})

    CURRENT_FACTORS = {
        "favorable": {"wind": 1, "wave": -0.1},
        "neutral": {"wind": 0, "wave": 0},
        "opposing": {"wind": -2, "wave": 0.3},
    }
    current_adjustment = CURRENT_FACTORS.get(current_direction, {"wind": 0, "wave": 0})

    wind_threshold = (
        BASE_WIND_THRESHOLD
        + vessel_factor * (size_factor + weight_factor + hull_factor)
        + monsoon_adjustment["wind"]
        + current_adjustment["wind"]
    )
    wave_threshold = (
        BASE_WAVE_THRESHOLD
        + vessel_factor * (size_factor + hull_factor)
        + monsoon_adjustment["wave"]
        + current_adjustment["wave"]
    )

    wind_threshold = max(10, min(30, wind_threshold))  # Wind: 10-30 knots
    wave_threshold = max(0.5, min(5, wave_threshold))  # Wave: 0.5-5 meters

    return round(wind_threshold, 2), round(wave_threshold, 2)


# Fitness function for evaluating a path
def calculate_fitness(path, weather_data, graph, ship_constraints):
    total_distance = 0
    wind_penalty = 0

    vessel_type = ship_constraints['type']
    size = ship_constraints['size']
    weight = ship_constraints['weight']
    hull_type = ship_constraints['hull_type']
    monsoon = ship_constraints['monsoon']
    current_speed = ship_constraints['current_speed']
    current_direction = ship_constraints['current_direction']

    wind_threshold, wave_threshold = calculate_thresholds(
        vessel_type, size, weight, hull_type, monsoon, current_speed, current_direction
    )

    visited_nodes = set()
    for i in range(len(path) - 1):
        current_node = path[i]
        next_node = path[i + 1]

        if current_node in visited_nodes:
            return float('inf')  # Skip if the node is already visited in this path
        visited_nodes.add(current_node)

        if current_node in graph and next_node in graph[current_node]:
            distance = graph[current_node][next_node]
            total_distance += distance
        else:
            print(f"Error: Missing edge between {current_node} and {next_node}. Assigning high penalty.")
            return float('inf')  # Return a very high fitness value for invalid paths

        if i < len(weather_data):
            wind_speed = weather_data[i].get('wind_speed', 0)
            if wind_speed > wind_threshold:
                wind_penalty += (wind_speed - wind_threshold) * 10  # Increase penalty for high winds

    return total_distance + wind_penalty  # Fitness = distance + penalty


# ACO: Generate paths
def generate_path(start, end):
    current_node = start
    path = [current_node]
    visited_nodes = {current_node}

    while current_node != end:
        if current_node not in graph:
            print(f"Error: Node {current_node} not found in the graph.")
            break

        neighbors = graph[current_node]
        valid_neighbors = [neighbor for neighbor in neighbors if neighbor not in visited_nodes]

        if not valid_neighbors:  # No valid neighbors left
            print(f"No valid neighbors left from node {current_node}. Breaking path generation.")
            break

        probabilities = []
        total_pheromone = 0
        for neighbor in valid_neighbors:
            distance = graph[current_node][neighbor]
            pheromone = pheromones[current_node].get(neighbor, 1)
            probability = (pheromone ** ALPHA) * ((1 / distance) ** BETA)
            probabilities.append(probability)
            total_pheromone += probability

        if total_pheromone == 0:
            print(f"No pheromone influence available for node {current_node}. Breaking path generation.")
            break

        probabilities = [p / total_pheromone for p in probabilities]

        # Select next node based on probabilities
        next_node = random.choices(valid_neighbors, weights=probabilities)[0]
        path.append(next_node)
        visited_nodes.add(next_node)
        current_node = next_node

    return path


# ACO: Update pheromones
def update_pheromones(paths):
    global pheromones
    for path in paths:
        fitness = calculate_fitness(path, weather_data, graph, ship_constraints)
        if fitness == float('inf'):
            continue
        for i in range(len(path) - 1):
            current_node = path[i]
            next_node = path[i + 1]
            pheromones[current_node][next_node] += 1 / fitness

    for node in pheromones:
        for neighbor in pheromones[node]:
            pheromones[node][neighbor] *= (1 - EVAPORATION_RATE)


# GA: Crossover operation
def crossover(parent1, parent2):
    cut = random.randint(1, len(parent1) - 2)
    child1 = parent1[:cut] + [p for p in parent2 if p not in parent1[:cut]]
    child2 = parent2[:cut] + [p for p in parent1 if p not in parent2[:cut]]

    child1 = list(dict.fromkeys(child1))  # Remove duplicates while preserving order
    child2 = list(dict.fromkeys(child2))  # Remove duplicates while preserving order

    return child1, child2


# GA: Mutation operation
def mutate(path):
    if random.random() < MUTATION_RATE:
        i, j = sorted(random.sample(range(len(path)), 2))
        path[i], path[j] = path[j], path[i]
    return path


# GA: Evolve population
def evolve_population(population):
    new_population = []
    while len(new_population) < POPULATION_SIZE:
        parent1, parent2 = random.sample(population, 2)
        if random.random() < CROSSOVER_RATE:
            child1, child2 = crossover(parent1, parent2)
            new_population.extend([mutate(child1), mutate(child2)])
        else:
            new_population.extend([mutate(parent1), mutate(parent2)])
    return new_population


# Hybrid ACO + GA
def hybrid_pathfinding(start, end):
    population = [generate_path(start, end) for _ in range(NUM_ANTS)]
    update_pheromones(population)

    for _ in range(NUM_GENERATIONS):
        population = evolve_population(population)

    best_path = min(population, key=lambda path: calculate_fitness(path, weather_data, graph, ship_constraints))
    return best_path, calculate_fitness(best_path, weather_data, graph, ship_constraints)


# Example ship constraints
ship_constraints = {
    "type": "Container Ship",
    "size": 5000,
    "weight": 70000,
    "hull_type": "streamlined",
    "monsoon": "Southwest",
    "current_speed": 2.0,
    "current_direction": "opposing"
}

# Main Execution
start_node = "Point-1"  # Chennai
end_node = "Point-50"  # Perth

optimal_path, fitness = hybrid_pathfinding(start_node, end_node)

# Map optimal path to latitudes and longitudes
optimal_path_with_coordinates = []
for point in optimal_path:
    # Assuming waypoints is a list, find the corresponding coordinates by index
    coordinates = waypoints[int(point.split('-')[1]) - 1]  # Example: "Point-1" => index 0
    if coordinates:
        optimal_path_with_coordinates.append({
            "point": point,
            "latitude": coordinates["Latitude"],
            "longitude": coordinates["Longitude"]
        })

# Save the results to a JSON file
with open('optimal_path_with_coordinates.json', 'w') as outfile:
    json.dump(optimal_path_with_coordinates, outfile, indent=4)

# Print the results
print(f"Optimal Path: {optimal_path}")
print(f"Fitness: {fitness}")
print(f"Optimal Path with Coordinates: {optimal_path_with_coordinates}")
