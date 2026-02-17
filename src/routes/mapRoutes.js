const express = require('express');

const createMapRouter = (mapController) => {
  const router = express.Router();

  router.post('/', mapController.create);
  router.get('/', mapController.getAll);
  router.get('/:id', mapController.getOne);
  router.put('/:id', mapController.update);
  router.delete('/:id', mapController.delete);

  return router;
};

module.exports = createMapRouter;
