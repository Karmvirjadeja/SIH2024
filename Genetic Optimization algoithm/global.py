import json


def calculate_fitness(node, previous_fitness):
    """Calculate the cumulative fitness to reach the current node."""
    # Add the current node's attributes to the previous cumulative values
    total_fuel = previous_fitness[0] + node["Fuel"]
    total_time = previous_fitness[1] + node["Time"]
    total_comfort = previous_fitness[2] + node["Comfort"]

    # Higher comfort is better, so invert it for minimization
    return total_fuel, total_time, -total_comfort


def find_optimal_path_dp(levels_data):
    """Find the global optimal path through all levels using Dynamic Programming."""
    levels = sorted(levels_data.keys(), key=lambda x: int(x.split()[1]))  # Sort levels in order

    # Initialize DP structures
    dp = {}  # Stores optimal fitness for each node in each level
    paths = {}  # Stores the path leading to each node

    # Process the first level
    for node in levels_data[levels[0]]:
        dp[node["Node"]] = (node["Fuel"], node["Time"], -node["Comfort"])
        paths[node["Node"]] = [node]

    # Process subsequent levels
    for level in levels[1:]:
        current_dp = {}
        current_paths = {}

        for current_node in levels_data[level]:
            best_fitness = None
            best_path = None

            for previous_node in levels_data[levels[levels.index(level) - 1]]:
                previous_fitness = dp[previous_node["Node"]]
                current_fitness = calculate_fitness(current_node, previous_fitness)

                if best_fitness is None or current_fitness < best_fitness:
                    best_fitness = current_fitness
                    best_path = paths[previous_node["Node"]] + [current_node]

            current_dp[current_node["Node"]] = best_fitness
            current_paths[current_node["Node"]] = best_path

        dp = current_dp
        paths = current_paths

    # Find the globally optimal path
    optimal_node = min(dp, key=dp.get)
    optimal_fitness = dp[optimal_node]
    optimal_path = paths[optimal_node]

    return optimal_path, optimal_fitness


# Load JSON data from file
file_path = "nsg_output.json"

try:
    with open(file_path, "r") as file:
        levels_data = json.load(file)
except FileNotFoundError:
    print(f"Error: The file {file_path} was not found.")
    exit()
except json.JSONDecodeError:
    print(f"Error: The file {file_path} does not contain valid JSON.")
    exit()

# Find the optimal path using DP
optimal_path, optimal_fitness = find_optimal_path_dp(levels_data)

# Save the optimal path to final.json
output_file_path = "final.json"

try:
    with open(output_file_path, "w") as output_file:
        json.dump(optimal_path, output_file, indent=4)
    print(f"Optimal path successfully saved to {output_file_path}.")
except IOError:
    print(f"Error: Unable to write to file {output_file_path}.")

# Print the result
print("Optimal Path:")
for node in optimal_path:
    print(node)

print("\nOptimal Fitness:")
print(f"Fuel: {optimal_fitness[0]}, Time: {optimal_fitness[1]}, Comfort: {-optimal_fitness[2]}")
