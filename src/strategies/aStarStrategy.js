
const IPathfindingStrategy = require('../interfaces/IPathfindingStrategy');

const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const createNode = (x, y, isWall = false) => ({
  x,
  y,
  isWall,
  g: Infinity,
  h: 0,
  f: Infinity,
  parent: null
});

class AStarStrategy extends IPathfindingStrategy {
  getName() {
    return 'A*';
  }

  findPath(width, height, obstacles, start, end) {
    const grid = this._createGrid(width, height, obstacles);

    if (!this._isValidPosition(start, width, height) || 
        !this._isValidPosition(end, width, height)) {
      return [];
    }

    const startNode = grid[start.y][start.x];
    const endNode = grid[end.y][end.x];

    if (endNode.isWall) return [];

    return this._executeAStar(grid, startNode, endNode, width, height);
  }

  _createGrid(width, height, obstacles) {
    const grid = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
        row.push(createNode(x, y, isObstacle));
      }
      grid.push(row);
    }
    return grid;
  }

  _isValidPosition(pos, width, height) {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
  }

  _executeAStar(grid, startNode, endNode, width, height) {
    const openSet = [startNode];
    const closedSet = [];

    startNode.g = 0;
    startNode.f = heuristic(startNode, endNode);

    while (openSet.length > 0) {
      const current = this._getLowestFNode(openSet);

      if (current.x === endNode.x && current.y === endNode.y) {
        return this._reconstructPath(current, startNode);
      }

      this._removeFromArray(openSet, current);
      closedSet.push(current);

      const neighbors = this._getNeighbors(current, grid, width, height);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.isWall) continue;

        const tempG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tempG >= neighbor.g) {
          continue;
        }

        neighbor.g = tempG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }

    return [];
  }

  _getLowestFNode(openSet) {
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    return openSet[lowestIndex];
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

module.exports = new AStarStrategy();
