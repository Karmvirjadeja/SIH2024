import random
import plotly.graph_objects as go

# Parameters
total_distance = 8000
node_interval = 111
num_paths = 5
levels = total_distance // node_interval

# Generate node positions, edges, and properties
node_positions = {}
node_properties = {}
edges = []

# Constants for fitness calculation
WIND_SPEED_THRESHOLD = 15  # Wind speed threshold (in knots)
WAVE_HEIGHT_THRESHOLD = 2  # Wave height threshold (in meters)
COMFORT_DECREASE_RATE = 10  # Rate of comfort decrease due to wave height and wind speed

# Start node
node_positions["Start"] = (0, 0)
node_properties["Start"] = {"distance": 0, "wave_height": 0, "wind_speed": 0}

# End node
node_positions["End"] = (total_distance, 0)
node_properties["End"] = {"distance": total_distance, "wave_height": 0, "wind_speed": 0}

# Intermediate nodes
for path in range(1, num_paths + 1):
    for level in range(1, levels):  # Intermediate levels
        node_id = f"P{path}_L{level}"
        x = level * node_interval  # Distance along x-axis
        y = path * 2  # Vertical position based on the path
        node_positions[node_id] = (x, y)

        # Assign random values for wave height and wind speed
        node_properties[node_id] = {
            "distance": x,
            "wave_height": round(random.uniform(0.5, 3.0), 2),  # Random wave height in meters
            "wind_speed": round(random.uniform(5, 25), 1),  # Random wind speed in knots
        }

        # Connect nodes in the same path
        if level == 1:
            edges.append(("Start", node_id))  # Connect start node
        else:
            edges.append((f"P{path}_L{level - 1}", node_id))

    # Connect last level of each path to the end node
    edges.append((f"P{path}_L{levels - 1}", "End"))

# Fitness Functions
def fuel_consumption(distance, wave_height, wind_speed):
    wind_resistance = max(0, (wind_speed - WIND_SPEED_THRESHOLD) * 0.05)
    wave_resistance = max(0, (wave_height - WAVE_HEIGHT_THRESHOLD) * 0.1)
    fuel = distance * (1 + wind_resistance + wave_resistance)
    return fuel

def travel_time(distance, wind_speed):
    wind_effect = 1 - max(0, (wind_speed - WIND_SPEED_THRESHOLD) * 0.05)
    time = distance / (20 * wind_effect) if wind_effect > 0 else float('inf')
    return time

def passenger_comfort(wave_height, wind_speed):
    comfort = 100 - (wave_height * COMFORT_DECREASE_RATE + wind_speed * COMFORT_DECREASE_RATE)
    return max(0, comfort)

# Next Step Greedy Algorithm (NSG)
def nsg_recursive(level, path_count, properties, current_path=[]):
    if level >= levels:  # Base case: end of levels
        print("Reached the end of all levels.")
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
        time = travel_time(distance, wind_speed)
        comfort = passenger_comfort(wave_height, wind_speed)

        node_fitness.append((node, fuel, time, comfort))

    # Sort nodes based on fuel (minimize), time (minimize), and comfort (maximize)
    sorted_nodes = sorted(node_fitness, key=lambda x: (x[1], x[2], -x[3]))

    # Print sorted nodes
    print(f"Level {level}: Sorted nodes (most optimal to least optimal):")
    for node, fuel, time, comfort in sorted_nodes:
        print(f"Node: {node} | Fuel: {fuel:.2f} | Time: {time:.2f} hours | Comfort: {comfort:.2f}")

    # Recursively proceed to the next level
    nsg_recursive(level + 1, path_count, properties, current_path + [sorted_nodes[0][0]])

# Plot Graph with Plotly
# Plot Graph with Plotly
# Plot Graph with Plotly
def plot_graph():
    # Scaling factor to increase spacing between nodes
    vertical_spacing_factor = 20

    # Adjust node positions for better spacing
    adjusted_positions = {
        node: (pos[0], pos[1] * vertical_spacing_factor)
        for node, pos in node_positions.items()
    }

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

    # Prepare hover text
    hover_texts = [
        f"Node: {node}<br>Distance: {props['distance']} km<br>Wave Height: {props['wave_height']} m<br>Wind Speed: {props['wind_speed']} knots"
        for node, props in node_properties.items()
    ]

    # Create Plotly figure
    fig = go.Figure()

    # Add edges
    fig.add_trace(go.Scatter(
        x=edge_x,
        y=edge_y,
        mode='lines',
        line=dict(color='gray', width=2),  # Slightly thicker lines
        hoverinfo='none'
    ))

    # Add nodes with hover text
    fig.add_trace(go.Scatter(
        x=node_x,
        y=node_y,
        mode='markers+text',
        text=node_labels,
        textposition="top center",
        marker=dict(size=12, color='blue'),  # Larger markers
        hoverinfo='text',
        hovertext=hover_texts
    ))

    # Enable zoom and drag
    fig.update_layout(
        title="Interactive Diverging and Converging Graph",
        xaxis=dict(title="Distance (km)", fixedrange=False),
        yaxis=dict(title="Paths", fixedrange=False),
        dragmode="pan",  # Enable dragging/panning
        showlegend=False,
        autosize=False,
        width=1920,  # Increased width for full-screen display
        height=1080,  # Increased height for full-screen display
        margin=dict(l=20, r=20, t=50, b=20),  # Reduced margins for more space
    )

    fig.show()

# Run the NSG algorithm and plot the graph
print("Running NSG algorithm:")
nsg_recursive(1, num_paths, node_properties)
plot_graph()
