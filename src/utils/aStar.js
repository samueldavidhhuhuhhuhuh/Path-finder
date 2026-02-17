/**
 * Wrapper de compatibilidad para mantener la función findPath original
 * Este archivo mantiene la compatibilidad con el código existente
 */
const aStarStrategy = require('../strategies/aStarStrategy');

const findPath = (width, height, obstacles, start, end) => {
  return aStarStrategy.findPath(width, height, obstacles, start, end);
};

module.exports = findPath;
