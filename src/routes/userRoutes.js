const express = require('express');

const createUserRouter = (userController) => {
  const router = express.Router();

  router.post('/', userController.create);
  router.get('/', userController.getAll);
  router.get('/:id', userController.getOne);
  router.put('/:id', userController.update);
  router.delete('/:id', userController.delete);

  return router;
};

module.exports = createUserRouter;
