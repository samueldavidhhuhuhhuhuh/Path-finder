
const aStarStrategy = require('./aStarStrategy');
const dijkstraStrategy = require('./dijkstraStrategy');

class PathfindingStrategyFactory {
  constructor() {
    this.strategies = new Map();
    this._registerDefaultStrategies();
  }

  _registerDefaultStrategies() {
    this.register('astar', aStarStrategy);
    this.register('dijkstra', dijkstraStrategy);
  }

  register(name, strategy) {
    this.strategies.set(name.toLowerCase(), strategy);
  }

  getStrategy(name = 'astar') {
    const strategy = this.strategies.get(name.toLowerCase());
    if (!strategy) {
      throw new Error(`Estrategia "${name}" no encontrada`);
    }
    return strategy;
  }

  getAvailableStrategies() {
    return Array.from(this.strategies.keys());
  }
}

module.exports = new PathfindingStrategyFactory();
