import random
import plotly.graph_objects as go

# Parameters
total_distance = 8000  # Total distance in km
node_interval = 111  # Interval between nodes in km
num_paths = 5  # Number of paths diverging and converging
levels = total_distance // node_interval  # Number of levels of nodes
display_window = 500  # Display window size in km

# Constants for fitness calculation
WIND_SPEED_THRESHOLD = 15  # Wind speed threshold (in knots)
WAVE_HEIGHT_THRESHOLD = 2  # Wave height threshold (in meters)
COMFORT_DECREASE_RATE = 10  # Rate of comfort decrease due to wave height and wind speed

# Fitness functions
def fuel_consumption(distance, wave_height, wind_speed):
    wind_resistance = max(0, (wind_speed - WIND_SPEED_THRESHOLD) * 0.05)
    wave_resistance = max(0, (wave_height - WAVE_HEIGHT_THRESHOLD) * 0.1)
    return distance * (1 + wind_resistance + wave_resistance)

def travel_time(distance, wind_speed):
    wind_effect = 1 - max(0, (wind_speed - WIND_SPEED_THRESHOLD) * 0.05)
    return distance / (20 * wind_effect) if wind_effect > 0 else float('inf')

def passenger_comfort(wave_height, wind_speed):
    comfort = 100 - (wave_height * COMFORT_DECREASE_RATE + wind_speed * COMFORT_DECREASE_RATE)
    return max(0, comfort)

# Generate node positions, edges, and properties
node_positions = {}
node_properties = {}
edges = []

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

# Evaluate nodes and return ranked coordinates
def rank_nodes():
    ranked_coordinates = []
    for level in range(1, levels):
        # Collect all nodes at this level
        level_nodes = [node for node in node_positions if f"_L{level}" in node]

        # Calculate fitness for each node
        node_fitness = []
        for node in level_nodes:
            props = node_properties[node]
            distance = props["distance"]
            wave_height = props["wave_height"]
            wind_speed = props["wind_speed"]

            fuel = fuel_consumption(distance, wave_height, wind_speed)
            time = travel_time(distance, wind_speed)
            comfort = passenger_comfort(wave_height, wind_speed)

            node_fitness.append((node, distance, fuel, time, comfort))

        # Sort by fuel (min), time (min), and comfort (max)
        node_fitness.sort(key=lambda x: (x[2], x[3], -x[4]))

        # Print sorted nodes for this level
        print(f"Ranked Nodes at Level {level}:")
        for idx, (node, distance, fuel, time, comfort) in enumerate(node_fitness):
            print(f"{idx + 1}. {node} | Distance: {distance} km | Fuel: {fuel} | Time: {time} hours | Comfort: {comfort}")

        # Append sorted coordinates to the ranked list
        ranked_coordinates.append([node_positions[node] for node, _, _, _, _ in node_fitness])

    return ranked_coordinates

# Plot Graph with Plotly
def plot_graph():
    # Prepare data for Plotly
    edge_x = []
    edge_y = []
    for edge in edges:
        start, end = edge
        edge_x += [node_positions[start][0], node_positions[end][0], None]
        edge_y += [node_positions[start][1], node_positions[end][1], None]

    node_x = [pos[0] for pos in node_positions.values()]
    node_y = [pos[1] for pos in node_positions.values()]
    node_labels = list(node_positions.keys())

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
        line=dict(color='gray', width=1),
        hoverinfo='none'
    ))

    # Add nodes with hover text
    fig.add_trace(go.Scatter(
        x=node_x,
        y=node_y,
        mode='markers+text',
        text=node_labels,
        textposition="top center",
        marker=dict(size=8, color='blue'),
        hoverinfo='text',
        hovertext=hover_texts
    ))

    # Slider steps
    steps = []
    for start in range(0, total_distance, display_window):
        step = dict(
            method="relayout",
            args=["xaxis.range", [start, start + display_window]],
            label=f"{start}-{start + display_window} km"
        )
        steps.append(step)

    # Add slider
    fig.update_layout(
        sliders=[dict(
            active=0,
            currentvalue={"prefix": "Visible Range: "},
            steps=steps
        )]
    )

    # Initial layout settings
    fig.update_layout(
        title="Interactive Diverging and Converging Graph with Slider",
        xaxis=dict(title="Distance (km)", range=[0, display_window], fixedrange=False),
        yaxis=dict(title="Paths", fixedrange=False),
        showlegend=False,
        hovermode="closest",
        dragmode="pan",
        margin=dict(l=0, r=0, t=40, b=0),
        autosize=True,
    )

    fig.show()

# Get ranked coordinates
ranked_coordinates = rank_nodes()

# Plot the graph
plot_graph()
