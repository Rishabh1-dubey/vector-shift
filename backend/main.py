from fastapi import FastAPI, Body
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    # Create adjacency list
    graph = {node['id']: [] for node in nodes}
    for edge in edges:
        graph[edge['source']].append(edge['target'])
    
    # Check for cycles using DFS
    visited = set()
    temp = set()
    
    def has_cycle(node: str) -> bool:
        if node in temp:
            return True
        if node in visited:
            return False
        
        temp.add(node)
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        temp.remove(node)
        visited.add(node)
        return False
    
    # Check each node for cycles
    for node in graph:
        if node not in visited:
            if has_cycle(node):
                return False
    
    return True

@app.post('/pipelines/parse')
async def parse_pipeline(data: dict = Body(...)):
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    return {
        'num_nodes': len(nodes),
        'num_edges': len(edges),
        'is_dag': is_dag(nodes, edges)
    }
