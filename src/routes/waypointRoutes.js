const express = require('express');

const createWaypointRouter = (waypointController) => {
  const router = express.Router();

  router.post('/', waypointController.create);
  router.get('/', waypointController.getAll);
  router.get('/:id', waypointController.getOne);
  router.put('/:id', waypointController.update);
  router.delete('/:id', waypointController.delete);

  return router;
};

module.exports = createWaypointRouter;
