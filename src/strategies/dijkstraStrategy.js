
const IPathfindingStrategy = require('../interfaces/IPathfindingStrategy');

class DijkstraStrategy extends IPathfindingStrategy {
  getName() {
    return 'Dijkstra';
  }

  findPath(width, height, obstacles, start, end) {
    // Implementación simplificada de Dijkstra
    // Similar a A* pero sin heurística
    const grid = this._createGrid(width, height, obstacles);

    if (!this._isValidPosition(start, width, height) || 
        !this._isValidPosition(end, width, height)) {
      return [];
    }

    const startNode = grid[start.y][start.x];
    const endNode = grid[end.y][end.x];

    if (endNode.isWall) return [];

    return this._executeDijkstra(grid, startNode, endNode, width, height);
  }

  _createGrid(width, height, obstacles) {
    const grid = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
        row.push({
          x,
          y,
          isWall: isObstacle,
          distance: Infinity,
          parent: null,
          visited: false
        });
      }
      grid.push(row);
    }
    return grid;
  }

  _isValidPosition(pos, width, height) {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
  }

  _executeDijkstra(grid, startNode, endNode, width, height) {
    const unvisited = [];
    startNode.distance = 0;

    // Agregar todos los nodos al conjunto de no visitados
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!grid[y][x].isWall) {
          unvisited.push(grid[y][x]);
        }
      }
    }

    while (unvisited.length > 0) {
      // Encontrar nodo con menor distancia
      const current = this._getMinDistanceNode(unvisited);
      
      if (current.distance === Infinity) break;

      this._removeFromArray(unvisited, current);
      current.visited = true;

      if (current.x === endNode.x && current.y === endNode.y) {
        return this._reconstructPath(current, startNode);
      }

      const neighbors = this._getNeighbors(current, grid, width, height);

      for (const neighbor of neighbors) {
        if (neighbor.visited || neighbor.isWall) continue;

        const alt = current.distance + 1;
        if (alt < neighbor.distance) {
          neighbor.distance = alt;
          neighbor.parent = current;
        }
      }
    }

    return [];
  }

  _getMinDistanceNode(nodes) {
    let minNode = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i].distance < minNode.distance) {
        minNode = nodes[i];
      }
    }
    return minNode;
  }

  _removeFromArray(array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  _getNeighbors(node, grid, width, height) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    for (const dir of directions) {
      const nx = node.x + dir.x;
      const ny = node.y + dir.y;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        neighbors.push(grid[ny][nx]);
      }
    }

    return neighbors;
  }

  _reconstructPath(endNode, startNode) {
    const path = [];
    let current = endNode;

    while (current.parent) {
      path.push({ x: current.x, y: current.y });
      current = current.parent;
    }

    path.push({ x: startNode.x, y: startNode.y });
    return path.reverse();
  }
}

module.exports = new DijkstraStrategy();
