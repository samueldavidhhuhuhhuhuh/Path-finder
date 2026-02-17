/**
 * UserService con Result Monad y validaciones
 */
const Result = require('../utils/result');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(data) {
    try {
      if (!data.username || !data.email) {
        return Result.fail("Username y Email son requeridos");
      }

      const user = await this.userRepository.create(data);
      return Result.ok(user);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return Result.ok(users);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return Result.fail("Usuario no encontrado");
      }
      return Result.ok(user);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async updateUser(id, data) {
    try {
      const updated = await this.userRepository.update(id, data);
      if (!updated) {
        return Result.fail("No se pudo actualizar (Usuario no encontrado)");
      }
      const user = await this.userRepository.findById(id);
      return Result.ok(user);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async deleteUser(id) {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        return Result.fail("Usuario no encontrado");
      }
      return Result.ok({ message: "Usuario eliminado" });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

const createUserService = (userRepository) => new UserService(userRepository);

module.exports = createUserService;
