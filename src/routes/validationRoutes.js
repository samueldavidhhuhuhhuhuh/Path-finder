const express = require('express');

const createValidationRouter = (validationController) => {
  const router = express.Router();

  router.post('/map-id-format', validationController.validateMapIdFormat);
  router.post('/map-exists', validationController.validateMapExists);
  router.get('/map-exists/:mapId', validationController.validateMapExists);
  router.post('/map-config', validationController.validateMapConfig);
  router.post('/map-dimensions', validationController.validateMapDimensions);
  router.post('/route-points', validationController.validateRoutePoints);
  router.post('/cyclic-dependencies', validationController.validateCyclicDependencies);
  router.post('/path-exists', validationController.validatePathExists);
  router.post('/route-intersections', validationController.validateRouteIntersections);
  router.post('/route-length', validationController.validateRouteLength);

  return router;
};

module.exports = createValidationRouter;
