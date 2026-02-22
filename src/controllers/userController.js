
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  create = async (req, res) => {
    const result = await this.userService.createUser(req.body);
    
    result.match({
      ok: (user) => res.status(201).json(user),
      fail: (error) => res.status(400).json({ error })
    });
  }

  getAll = async (req, res) => {
    const result = await this.userService.getAllUsers();
    
    result.match({
      ok: (users) => res.status(200).json(users),
      fail: (error) => res.status(500).json({ error })
    });
  }

  getOne = async (req, res) => {
    const result = await this.userService.getUserById(req.params.id);
    
    result.match({
      ok: (user) => res.status(200).json(user),
      fail: (error) => res.status(404).json({ error })
    });
  }

  update = async (req, res) => {
    const result = await this.userService.updateUser(req.params.id, req.body);
    
    result.match({
      ok: (user) => res.status(200).json(user),
      fail: (error) => {
        const status = error.includes("no encontrado") ? 404 : 400;
        res.status(status).json({ error });
      }
    });
  }

  delete = async (req, res) => {
    const result = await this.userService.deleteUser(req.params.id);
    
    result.match({
      ok: (response) => res.status(200).json(response),
      fail: (error) => res.status(404).json({ error })
    });
  }
}

const createUserController = (userService) => new UserController(userService);

module.exports = createUserController;
