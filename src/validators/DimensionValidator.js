
class DimensionValidator {
  static validate(width, height) {
    if (!width || !height) {
      return {
        isValid: false,
        error: 'Width y Height son requeridos'
      };
    }

    if (typeof width !== 'number' || typeof height !== 'number') {
      return {
        isValid: false,
        error: 'Width y Height deben ser números'
      };
    }

    if (width <= 0 || height <= 0) {
      return {
        isValid: false,
        error: 'Width y Height deben ser mayores a 0'
      };
    }

    return { isValid: true };
  }

  static areDimensionsValid(width, height) {
    return width > 0 && height > 0;
  }
}

module.exports = DimensionValidator;
