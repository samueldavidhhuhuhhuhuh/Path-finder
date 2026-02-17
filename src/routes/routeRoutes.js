const express = require('express');

const createRouteRouter = (routeController) => {
  const router = express.Router();

  router.post('/', routeController.calculate);
  router.get('/', routeController.getAll);
  router.get('/:id', routeController.getOne);

  return router;
};

module.exports = createRouteRouter;
