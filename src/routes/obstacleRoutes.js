const express = require('express');

const createObstacleRouter = (obstacleController) => {
  const router = express.Router();

  router.post('/', obstacleController.create);
  router.get('/', obstacleController.getAll);
  router.get('/:id', obstacleController.getOne);
  router.put('/:id', obstacleController.update);
  router.delete('/:id', obstacleController.delete);

  return router;
};

module.exports = createObstacleRouter;
