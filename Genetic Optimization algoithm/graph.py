import random
import plotly.graph_objects as go

# Parameters
total_distance = 8000
node_interval = 111
num_paths = 5
levels = total_distance // node_interval

# Generate node positions, edges, and additional properties
node_positions = {}
node_properties = {}  # To store properties for each node
edges = []

# Start node
node_positions["Start"] = (0, 0)
node_properties["Start"] = {
    "distance": 0,
    "wave_height": 0,
    "wind_speed": 0,
}

# End node
node_positions["End"] = (total_distance, 0)
node_properties["End"] = {
    "distance": total_distance,
    "wave_height": 0,
    "wind_speed": 0,
}

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
    hovertext=hover_texts  # Include hover text
))

# Layout adjustments for full-screen view and zooming
fig.update_layout(
    title="Interactive Diverging and Converging Graph",
    xaxis=dict(
        title="Distance (km)",
        range=[0, 500],  # Show only the next 500 km initially
        fixedrange=False,  # Allow zooming horizontally
    ),
    yaxis=dict(
        title="Paths",
        fixedrange=False,  # Allow zooming vertically
    ),
    showlegend=False,
    autosize=True,  # Automatically adjust size to fill screen
    margin=dict(l=0, r=0, t=40, b=0),  # Remove unnecessary margins
)

# Enable Google Maps-like zooming and panning
fig.update_layout(dragmode='pan', hovermode='closest')

# Add full-screen toggle capability
fig.update_layout(
    updatemenus=[
        dict(
            type="buttons",
            showactive=False,
            buttons=[
                dict(
                    label="Full Screen",
                    method="relayout",
                    args=["xaxis.range", [0, total_distance]],  # Show full range
                )
            ],
            x=0.8,
            y=1.15,
        )
    ]
)

fig.show()
