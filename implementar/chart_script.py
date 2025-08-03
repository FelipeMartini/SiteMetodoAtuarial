import plotly.graph_objects as go
import json

# Data from the provided JSON
data = {"categories": ["Performance Issues", "Architecture Issues", "Code Quality Issues", "Modern Practices Missing"], "values": [6, 5, 5, 5]}

categories = data["categories"]
values = data["values"]

# Shorten category names to meet 15-character limit while maintaining clarity
short_categories = ["Performance", "Architecture", "Code Quality", "Modern Practice"]

# Brand colors
colors = ["#1FB8CD", "#DB4545", "#2E8B57", "#5D878F"]

# Create horizontal bar chart
fig = go.Figure(data=[
    go.Bar(
        y=short_categories,
        x=values,
        orientation='h',
        marker_color=colors,
        text=values,
        textposition='auto',
        textfont=dict(color='white', size=16, family='Arial Black')
    )
])

# Update layout with exact title from instructions
fig.update_layout(
    title="Problemas Identificados no Projeto SiteMetodoAtuarial",
    xaxis_title="Qtd Problemas",
    yaxis_title="Categoria"
)

# Save the chart
fig.write_image("problemas_projeto_chart.png")