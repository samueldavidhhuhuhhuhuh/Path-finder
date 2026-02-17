/**
 * Manejo de Errores usando Monads
 * Result Monad para manejar errores de forma funcional
 */
class Result {
  constructor(isError, value, error) {
    this.isError = isError;
    this.value = value;
    this.error = error;
    Object.freeze(this);
  }

  static ok(value) {
    return new Result(false, value, null);
  }

  static fail(error) {
    return new Result(true, null, error);
  }

  isOk() {
    return !this.isError;
  }

  isFail() {
    return this.isError;
  }

  match({ ok, fail }) {
    return this.isError ? fail(this.error) : ok(this.value);
  }

  map(fn) {
    if (this.isError) return this;
    try {
      return Result.ok(fn(this.value));
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  flatMap(fn) {
    if (this.isError) return this;
    try {
      return fn(this.value);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  getOrElse(defaultValue) {
    return this.isError ? defaultValue : this.value;
  }

  getOrThrow() {
    if (this.isError) {
      throw new Error(this.error);
    }
    return this.value;
  }
}

module.exports = Result;
