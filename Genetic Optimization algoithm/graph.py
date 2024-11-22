import plotly.graph_objects as go

# Parameters
total_distance = 8000
node_interval = 111
num_paths = 5
levels = total_distance // node_interval

# Generate node positions and edges
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
        y = path * 2  # Vertical position based on the path
        node_positions[node_id] = (x, y)

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

# Add nodes
fig.add_trace(go.Scatter(
    x=node_x,
    y=node_y,
    mode='markers+text',
    text=node_labels,
    textposition="top center",
    marker=dict(size=8, color='blue'),
))

# Layout adjustments for full screen and zooming
fig.update_layout(
    title="Interactive Diverging and Converging Graph",
    xaxis=dict(
        title="Distance (km)",
        range=[0, 500],  # Show only the next 500 km initially
        fixedrange=False,  # Allow zooming
    ),
    yaxis=dict(
        title="Paths",
        fixedrange=False,  # Allow zooming vertically as well
    ),
    showlegend=False,
    width=1500,  # Full-screen width
    height=800,  # Full-screen height
    autosize=True,  # Auto-adjust to screen size
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
