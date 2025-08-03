import plotly.graph_objects as go
import plotly.io as pio

# Data
metrics = ["Bundle Size (MB)", "First Contentful Paint (s)", "Largest Contentful Paint (s)", "Time to Interactive (s)"]
current = [2.5, 3.5, 4.5, 5.5]
optimized = [1.0, 1.5, 2.5, 2.5]

# Abbreviate metric names to fit 15 character limit
metrics_short = ["Bundle Size", "First Paint", "Largest Paint", "Interactive"]

# Create the figure
fig = go.Figure()

# Add current performance bars
fig.add_trace(go.Bar(
    x=metrics_short,
    y=current,
    name='Current',
    marker_color='#DB4545',  # Bright red
    text=current,
    textposition='outside',
    cliponaxis=False
))

# Add optimized performance bars
fig.add_trace(go.Bar(
    x=metrics_short,
    y=optimized,
    name='Optimized',
    marker_color='#2E8B57',  # Sea green
    text=optimized,
    textposition='outside',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Performance: Current vs Optimized',
    xaxis_title='Metrics',
    yaxis_title='Values',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('performance_comparison.png')