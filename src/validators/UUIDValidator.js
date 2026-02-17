class UUIDValidator {
  static isValidUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  static validateRecursive(id, index = 0) {
    if (typeof id !== 'string') {
      return { isValid: false, error: 'el id debe ser un string' };
    }

    if (index >= id.length) {
      return this.isValidUUID(id) 
        ? { isValid: true } 
        : { isValid: false, error: 'formato invalido del id del mapa' };
    }

    const char = id[index];
    const isValidChar = /[0-9a-f-]/i.test(char);
    
    if (!isValidChar) {
      return { isValid: false, error: 'formato invalido del id del mapa' };
    }

    return this.validateRecursive(id, index + 1);
  }

  static validate(id) {
    if (!id) {
      return { isValid: false, error: 'el id es requerido' };
    }

    return this.validateRecursive(id);
  }
}

module.exports = UUIDValidator;
