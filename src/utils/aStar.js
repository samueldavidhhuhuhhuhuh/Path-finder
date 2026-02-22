 
const aStarStrategy = require('../strategies/aStarStrategy');

const findPath = (width, height, obstacles, start, end) => {
  return aStarStrategy.findPath(width, height, obstacles, start, end);
};

module.exports = findPath;
