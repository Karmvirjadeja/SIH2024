import random
import plotly.graph_objects as go
from threshold import calculate_thresholds
from resistance import calculate_dynamic_resistance
import json
from collections import Counter
# Storage for node information at each level
nsg_output = {}

# Parameters
total_distance = 8000
node_interval = 111
num_paths = 5
levels = total_distance // node_interval

# Vessel properties for threshold calculation
vessel_type = "Container Ship"
size = 5000  # TEU for container ships
weight = 70000  # Tons
hull_properties = {"stability_factor": 1.2}
monsoon = "Southwest"
current_speed = 2.0  # Knots
current_direction = "opposing"
WIND_SPEED_THRESHOLD, WAVE_HEIGHT_THRESHOLD = calculate_thresholds(
    vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
)
COMFORT_DECREASE_RATE = 10  # Rate of comfort decrease due to wave height and wind speed

# Node positions and edges
node_positions = {}
edges = []

# Start node
node_positions["Start"] = (0, 0)

# End node
node_positions["End"] = (total_distance, 0)

# Intermediate nodes
for path in range(1, num_paths + 1):
    for level in range(1, levels):  # Intermediate levels
        node_id = f"P{path}_L{level}"
        x = level * node_interval  # Distance along x-axis
        y = path * 3  # Vertical position based on the path (increased vertical spacing)
        node_positions[node_id] = (x, y)

        # Connect nodes in the same path
        if level == 1:
            edges.append(("Start", node_id))  # Connect start node
        else:
            edges.append((f"P{path}_L{level - 1}", node_id))

    # Connect last level of each path to the end node
    edges.append((f"P{path}_L{levels - 1}", "End"))

# Function to calculate wave height and wind speed based on position
def get_node_properties(x, y):
    """Dynamic wave height and wind speed calculation."""
    wave_height = round(0.5 + 0.002 * y + random.uniform(0, 1), 2)  # Dynamic wave height
    wind_speed = round(10 + 0.01 * x + random.uniform(0, 5), 1)  # Dynamic wind speed
    return wave_height, wind_speed

# Node properties
node_properties = {
    node: {
        "distance": x,
        "wave_height": get_node_properties(x, y)[0],
        "wind_speed": get_node_properties(x, y)[1],
    }
    for node, (x, y) in node_positions.items()
}

# Fitness Functions
def fuel_consumption(distance, wave_height, wind_speed):
    wind_resistance_factor, wave_resistance_factor = calculate_dynamic_resistance(
        wind_speed, wave_height, vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
    )
    wind_resistance = max(0, (wind_speed - WIND_SPEED_THRESHOLD) * wind_resistance_factor)
    wave_resistance = max(0, (wave_height - WAVE_HEIGHT_THRESHOLD) * wave_resistance_factor)
    fuel = distance * (1 + wind_resistance + wave_resistance)
    return fuel

def travel_time(distance, wind_speed, wave_height):
    wind_resistance_factor, wave_resistance_factor = calculate_dynamic_resistance(
        wind_speed, wave_height, vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
    )
    wind_effect = 1 - max(0, (wind_speed - WIND_SPEED_THRESHOLD) * wind_resistance_factor)
    time = distance / (20 * wind_effect) if wind_effect > 0 else float('inf')
    return time

def passenger_comfort(wave_height, wind_speed):
    comfort = 100 - (wave_height * COMFORT_DECREASE_RATE + wind_speed * COMFORT_DECREASE_RATE)
    return max(0, comfort)

# Next Step Greedy Algorithm (NSG) with JSON saving
def nsg_recursive(level, path_count, properties, current_path=[]):
    if level >= levels:  # Base case: end of levels
        print("Reached the end of all levels.")
        # Save the JSON output to a file
        with open("nsg_output.json", "w") as file:
            json.dump(nsg_output, file, indent=4)
        return

    # Get next nodes from all paths
    next_nodes = []
    for path in range(1, path_count + 1):
        node_id = f"P{path}_L{level}"
        if node_id in properties:
            next_nodes.append(node_id)

    # Calculate fitness for the nodes
    node_fitness = []
    for node in next_nodes:
        distance = properties[node]["distance"]
        wave_height = properties[node]["wave_height"]
        wind_speed = properties[node]["wind_speed"]
        
        fuel = fuel_consumption(distance, wave_height, wind_speed)
        time = travel_time(distance, wind_speed, wave_height)
        comfort = passenger_comfort(wave_height, wind_speed)

        node_fitness.append((node, fuel, time, comfort, wave_height, wind_speed))

    # Sort nodes based on fuel (minimize), time (minimize), and comfort (maximize)
    sorted_nodes = sorted(node_fitness, key=lambda x: (x[1], x[2], -x[3]))

    # Print and save sorted nodes
    print(f"Level {level}: Sorted nodes (most optimal to least optimal):")
    level_output = []
    for node, fuel, time, comfort, wave_height, wind_speed in sorted_nodes:
        print(f"Node: {node} | Fuel: {fuel:.2f} | Time: {time:.2f} hours | Comfort: {comfort:.2f} | Wave Height: {wave_height:.2f} m | Wind Speed: {wind_speed:.2f} knots")
        level_output.append({
            "Node": node,
            "Fuel": round(fuel, 2),
            "Time": round(time, 2),
            "Comfort": round(comfort, 2),
            "Wave Height": round(wave_height, 2),
            "Wind Speed": round(wind_speed, 2),
        })

    # Save level output in the global dictionary
    nsg_output[f"Level {level}"] = level_output

    # Recursively proceed to the next level
    nsg_recursive(level + 1, path_count, properties, current_path + [sorted_nodes[0][0]])




def count_red_nodes(final_file, node_positions):
    # Load the final nodes from the `final.json` file
    with open(final_file, "r") as file:
        final_nodes = [entry["Node"] for entry in json.load(file)]

    # Group red nodes by their paths (e.g., P1, P2)
    path_counts = Counter()
    for node in final_nodes:
        if node.startswith("P"):  # Ensure it's a valid path node
            path = node.split("_")[0]  # Extract path (e.g., P1, P2)
            path_counts[path] += 1

    # Find the path with the maximum count
    max_path, max_count = max(path_counts.items(), key=lambda x: x[1])

    print("Red Node Counts per Path:")
    for path, count in path_counts.items():
        print(f"{path}: {count} red nodes")

    print(f"\nPath with the maximum red nodes: {max_path} ({max_count} red nodes)")

    return path_counts, max_path, max_count



# Plot Graph
def plot_graph_google_maps_style():
    # Adjust node positions for better spacing
    adjusted_positions = node_positions

    # Prepare data for Plotly
    edge_x = []
    edge_y = []
    for edge in edges:
        start, end = edge
        edge_x += [adjusted_positions[start][0], adjusted_positions[end][0], None]
        edge_y += [adjusted_positions[start][1], adjusted_positions[end][1], None]

    node_x = [pos[0] for pos in adjusted_positions.values()]
    node_y = [pos[1] for pos in adjusted_positions.values()]
    node_labels = list(adjusted_positions.keys())

    # Hover text
    hover_texts = [
        f"Node: {node}<br>Distance: {props['distance']} km<br>Wave Height: {props['wave_height']} m<br>Wind Speed: {props['wind_speed']} knots"
        for node, props in node_properties.items()
    ]

    # Create Plotly figure
    fig = go.Figure()

    # Add edges
    fig.add_trace(go.Scatter(
        x=edge_x, y=edge_y, mode='lines',
        line=dict(color='gray', width=2), hoverinfo='none'
    ))

    # Add nodes with hover text
    fig.add_trace(go.Scatter(
        x=node_x, y=node_y, mode='markers+text',
        text=node_labels, textposition="top center",
        marker=dict(size=15, color='blue'),
        hoverinfo='text', hovertext=hover_texts
    ))

    # Layout settings
    fig.update_layout(
        title="Interactive Diverging and Converging Graph",
        xaxis=dict(title="Distance (km)", showgrid=True),
        yaxis=dict(title="Paths", showgrid=True),
        width=6000, height=900,
        dragmode="pan", showlegend=False
    )
    fig.show()


# Run the NSG and plot
nsg_recursive(1, num_paths, node_properties)
plot_graph_google_maps_style()
import random
import plotly.graph_objects as go
from threshold import calculate_thresholds
from resistance import calculate_dynamic_resistance
import json

# Storage for node information at each level
nsg_output = {}

# Parameters
total_distance = 8000
node_interval = 111
num_paths = 5
levels = total_distance // node_interval

# Vessel properties for threshold calculation
vessel_type = "Container Ship"
size = 5000  # TEU for container ships
weight = 70000  # Tons
hull_properties = {"stability_factor": 1.2}
monsoon = "Southwest"
current_speed = 2.0  # Knots
current_direction = "opposing"
WIND_SPEED_THRESHOLD, WAVE_HEIGHT_THRESHOLD = calculate_thresholds(
    vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
)
COMFORT_DECREASE_RATE = 10  # Rate of comfort decrease due to wave height and wind speed

# Node positions and edges
node_positions = {}
edges = []

# Start node
node_positions["Start"] = (0, 0)

# End node
node_positions["End"] = (total_distance, 0)

# Intermediate nodes
for path in range(1, num_paths + 1):
    for level in range(1, levels):  # Intermediate levels
        node_id = f"P{path}_L{level}"
        x = level * node_interval  # Distance along x-axis
        y = path * 3  # Vertical position based on the path (increased vertical spacing)
        node_positions[node_id] = (x, y)

        # Connect nodes in the same path
        if level == 1:
            edges.append(("Start", node_id))  # Connect start node
        else:
            edges.append((f"P{path}_L{level - 1}", node_id))

    # Connect last level of each path to the end node
    edges.append((f"P{path}_L{levels - 1}", "End"))

# Function to calculate wave height and wind speed based on position
def get_node_properties(x, y):
    """Dynamic wave height and wind speed calculation."""
    wave_height = round(0.5 + 0.002 * y + random.uniform(0, 1), 2)  # Dynamic wave height
    wind_speed = round(10 + 0.01 * x + random.uniform(0, 5), 1)  # Dynamic wind speed
    return wave_height, wind_speed

# Node properties
node_properties = {
    node: {
        "distance": x,
        "wave_height": get_node_properties(x, y)[0],
        "wind_speed": get_node_properties(x, y)[1],
    }
    for node, (x, y) in node_positions.items()
}

# Fitness Functions
def fuel_consumption(distance, wave_height, wind_speed):
    wind_resistance_factor, wave_resistance_factor = calculate_dynamic_resistance(
        wind_speed, wave_height, vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
    )
    wind_resistance = max(0, (wind_speed - WIND_SPEED_THRESHOLD) * wind_resistance_factor)
    wave_resistance = max(0, (wave_height - WAVE_HEIGHT_THRESHOLD) * wave_resistance_factor)
    fuel = distance * (1 + wind_resistance + wave_resistance)
    return fuel

def travel_time(distance, wind_speed, wave_height):
    wind_resistance_factor, wave_resistance_factor = calculate_dynamic_resistance(
        wind_speed, wave_height, vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
    )
    wind_effect = 1 - max(0, (wind_speed - WIND_SPEED_THRESHOLD) * wind_resistance_factor)
    time = distance / (20 * wind_effect) if wind_effect > 0 else float('inf')
    return time

def passenger_comfort(wave_height, wind_speed):
    comfort = 100 - (wave_height * COMFORT_DECREASE_RATE + wind_speed * COMFORT_DECREASE_RATE)
    return max(0, comfort)

# Next Step Greedy Algorithm (NSG) with JSON saving
def nsg_recursive(level, path_count, properties, current_path=[]):
    if level >= levels:  # Base case: end of levels
        print("Reached the end of all levels.")
        # Save the JSON output to a file
        with open("nsg_output.json", "w") as file:
            json.dump(nsg_output, file, indent=4)
        return

    # Get next nodes from all paths
    next_nodes = []
    for path in range(1, path_count + 1):
        node_id = f"P{path}_L{level}"
        if node_id in properties:
            next_nodes.append(node_id)

    # Calculate fitness for the nodes
    node_fitness = []
    for node in next_nodes:
        distance = properties[node]["distance"]
        wave_height = properties[node]["wave_height"]
        wind_speed = properties[node]["wind_speed"]
        
        fuel = fuel_consumption(distance, wave_height, wind_speed)
        time = travel_time(distance, wind_speed, wave_height)
        comfort = passenger_comfort(wave_height, wind_speed)

        node_fitness.append((node, fuel, time, comfort, wave_height, wind_speed))

    # Sort nodes based on fuel (minimize), time (minimize), and comfort (maximize)
    sorted_nodes = sorted(node_fitness, key=lambda x: (x[1], x[2], -x[3]))

    # Print and save sorted nodes
    print(f"Level {level}: Sorted nodes (most optimal to least optimal):")
    level_output = []
    for node, fuel, time, comfort, wave_height, wind_speed in sorted_nodes:
        print(f"Node: {node} | Fuel: {fuel:.2f} | Time: {time:.2f} hours | Comfort: {comfort:.2f} | Wave Height: {wave_height:.2f} m | Wind Speed: {wind_speed:.2f} knots")
        level_output.append({
            "Node": node,
            "Fuel": round(fuel, 2),
            "Time": round(time, 2),
            "Comfort": round(comfort, 2),
            "Wave Height": round(wave_height, 2),
            "Wind Speed": round(wind_speed, 2),
        })

    # Save level output in the global dictionary
    nsg_output[f"Level {level}"] = level_output

    # Recursively proceed to the next level
    nsg_recursive(level + 1, path_count, properties, current_path + [sorted_nodes[0][0]])

# Plot Graph
def plot_graph_google_maps_style():
    # Load `final.json` to get the list of nodes to mark red
    with open("final.json", "r") as file:
        final_nodes = {entry["Node"] for entry in json.load(file)}
    
    # Adjust node positions for better spacing
    adjusted_positions = node_positions

    # Prepare data for Plotly
    edge_x = []
    edge_y = []
    for edge in edges:
        start, end = edge
        edge_x += [adjusted_positions[start][0], adjusted_positions[end][0], None]
        edge_y += [adjusted_positions[start][1], adjusted_positions[end][1], None]

    node_x = [pos[0] for pos in adjusted_positions.values()]
    node_y = [pos[1] for pos in adjusted_positions.values()]
    node_labels = list(adjusted_positions.keys())

    # Color nodes based on `final.json`
    node_colors = ["red" if node in final_nodes else "blue" for node in node_labels]

    # Hover text
    hover_texts = [
        f"Node: {node}<br>Distance: {props['distance']} km<br>Wave Height: {props['wave_height']} m<br>Wind Speed: {props['wind_speed']} knots"
        for node, props in node_properties.items()
    ]

    # Create Plotly figure
    fig = go.Figure()

    # Add edges
    fig.add_trace(go.Scatter(
        x=edge_x, y=edge_y, mode='lines',
        line=dict(color='gray', width=2), hoverinfo='none'
    ))

    # Add nodes with hover text and colors
    fig.add_trace(go.Scatter(
        x=node_x, y=node_y, mode='markers+text',
        text=node_labels, textposition="top center",
        marker=dict(size=15, color=node_colors),
        hoverinfo='text', hovertext=hover_texts
    ))

    # Layout settings
    fig.update_layout(
        title="Interactive Diverging and Converging Graph",
        xaxis=dict(title="Distance (km)", showgrid=True),
        yaxis=dict(title="Paths", showgrid=True),
        width=6000, height=900,
        dragmode="pan", showlegend=False
    )
    fig.show()


# Run the NSG and plot
nsg_recursive(1, num_paths, node_properties)
plot_graph_google_maps_style()
final_file = "final.json"  # Path to the final JSON file
path_counts, max_path, max_count = count_red_nodes(final_file, node_positions)