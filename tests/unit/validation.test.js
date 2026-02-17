const DimensionValidator = require('../../src/validators/DimensionValidator');
const MapDataValidator = require('../../src/validators/MapDataValidator');
const MapDataTransformer = require('../../src/transformers/MapDataTransformer');
const Result = require('../../src/utils/result');

describe('Tests de Cobertura - Validators y Transformers', () => {
  describe('DimensionValidator', () => {
    test('Debe validar dimensiones correctas', () => {
      const result = DimensionValidator.validate(10, 10);
      expect(result.isValid).toBe(true);
    });

    test('Debe fallar cuando width es 0', () => {
      const result = DimensionValidator.validate(0, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('mayores a 0');
    });

    test('Debe fallar cuando height es 0', () => {
      const result = DimensionValidator.validate(10, 0);
      expect(result.isValid).toBe(false);
    });

    test('Debe fallar cuando width es negativo', () => {
      const result = DimensionValidator.validate(-5, 10);
      expect(result.isValid).toBe(false);
    });

    test('Debe fallar cuando height es undefined', () => {
      const result = DimensionValidator.validate(10, undefined);
      expect(result.isValid).toBe(false);
    });

    test('areDimensionsValid debe retornar true para dimensiones válidas', () => {
      expect(DimensionValidator.areDimensionsValid(10, 10)).toBe(true);
    });

    test('areDimensionsValid debe retornar false para dimensiones inválidas', () => {
      expect(DimensionValidator.areDimensionsValid(0, 10)).toBe(false);
      expect(DimensionValidator.areDimensionsValid(10, -1)).toBe(false);
    });
  });

  describe('MapDataValidator', () => {
    test('Debe validar datos de creación correctos', () => {
      const data = { name: 'Test', width: 10, height: 10 };
      const result = MapDataValidator.validateCreateData(data);
      expect(result.isValid).toBe(true);
    });

    test('Debe fallar si falta el nombre', () => {
      const data = { width: 10, height: 10 };
      const result = MapDataValidator.validateCreateData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('nombre');
    });

    test('Debe fallar si las dimensiones son inválidas', () => {
      const data = { name: 'Test', width: 0, height: 10 };
      const result = MapDataValidator.validateCreateData(data);
      expect(result.isValid).toBe(false);
    });

    test('Debe validar datos con formato dimensions', () => {
      const data = { name: 'Test', dimensions: { width: 10, height: 10 } };
      const result = MapDataValidator.validateCreateData(data);
      expect(result.isValid).toBe(true);
    });

    test('Debe validar datos de actualización correctos', () => {
      const existingMap = { width: 10, height: 10 };
      const data = { name: 'Updated' };
      const result = MapDataValidator.validateUpdateData(data, existingMap);
      expect(result.isValid).toBe(true);
    });

    test('Debe validar actualización de dimensiones', () => {
      const existingMap = { width: 10, height: 10 };
      const data = { width: 20 };
      const result = MapDataValidator.validateUpdateData(data, existingMap);
      expect(result.isValid).toBe(true);
    });

    test('Debe fallar actualización con dimensiones inválidas', () => {
      const existingMap = { width: 10, height: 10 };
      const data = { width: -5 };
      const result = MapDataValidator.validateUpdateData(data, existingMap);
      expect(result.isValid).toBe(false);
    });
  });

  describe('MapDataTransformer', () => {
    test('Debe transformar datos de creación', () => {
      const data = { name: 'Test', width: 10, height: 10, obstacles: [] };
      const result = MapDataTransformer.toCreateDTO(data);
      expect(result.name).toBe('Test');
      expect(result.width).toBe(10);
      expect(result.height).toBe(10);
    });

    test('Debe transformar datos con formato dimensions', () => {
      const data = { name: 'Test', dimensions: { width: 10, height: 10 } };
      const result = MapDataTransformer.toCreateDTO(data);
      expect(result.width).toBe(10);
      expect(result.height).toBe(10);
    });

    test('Debe transformar datos de actualización', () => {
      const data = { name: 'Updated', width: 20 };
      const result = MapDataTransformer.toUpdateDTO(data);
      expect(result.name).toBe('Updated');
      expect(result.width).toBe(20);
    });

    test('Debe transformar respuesta a DTO', () => {
      const map = { id: 1, name: 'Test', width: 10, height: 10, obstaclesConfig: [] };
      const result = MapDataTransformer.toResponseDTO(map);
      expect(result.id).toBe(1);
      expect(result.dimensions.width).toBe(10);
      expect(result.dimensions.height).toBe(10);
    });

    test('Debe manejar obstaclesConfig en toCreateDTO', () => {
      const data = { name: 'Test', width: 10, height: 10, obstaclesConfig: [{x:1,y:1}] };
      const result = MapDataTransformer.toCreateDTO(data);
      expect(result.obstaclesConfig).toHaveLength(1);
    });
  });

  describe('Result Monad', () => {
    test('ok debe crear Result exitoso', () => {
      const result = Result.ok('value');
      expect(result.isOk()).toBe(true);
      expect(result.isFail()).toBe(false);
      expect(result.value).toBe('value');
    });

    test('fail debe crear Result con error', () => {
      const result = Result.fail('error');
      expect(result.isOk()).toBe(false);
      expect(result.isFail()).toBe(true);
      expect(result.error).toBe('error');
    });

    test('match debe ejecutar ok callback', () => {
      const result = Result.ok('value');
      const matched = result.match({
        ok: (val) => `success: ${val}`,
        fail: (err) => `error: ${err}`
      });
      expect(matched).toBe('success: value');
    });

    test('match debe ejecutar fail callback', () => {
      const result = Result.fail('error');
      const matched = result.match({
        ok: (val) => `success: ${val}`,
        fail: (err) => `error: ${err}`
      });
      expect(matched).toBe('error: error');
    });

    test('map debe transformar valor en Result exitoso', () => {
      const result = Result.ok(5);
      const mapped = result.map(x => x * 2);
      expect(mapped.value).toBe(10);
    });

    test('map debe mantener error en Result fallido', () => {
      const result = Result.fail('error');
      const mapped = result.map(x => x * 2);
      expect(mapped.error).toBe('error');
    });

    test('map debe capturar excepciones', () => {
      const result = Result.ok(5);
      const mapped = result.map(() => { throw new Error('test error'); });
      expect(mapped.isFail()).toBe(true);
    });

    test('flatMap debe aplicar función que retorna Result', () => {
      const result = Result.ok(5);
      const flatMapped = result.flatMap(x => Result.ok(x * 2));
      expect(flatMapped.value).toBe(10);
    });

    test('flatMap debe mantener error', () => {
      const result = Result.fail('error');
      const flatMapped = result.flatMap(x => Result.ok(x * 2));
      expect(flatMapped.error).toBe('error');
    });

    test('flatMap debe capturar excepciones', () => {
      const result = Result.ok(5);
      const flatMapped = result.flatMap(() => { throw new Error('test error'); });
      expect(flatMapped.isFail()).toBe(true);
    });

    test('getOrElse debe retornar valor si es exitoso', () => {
      const result = Result.ok('value');
      expect(result.getOrElse('default')).toBe('value');
    });

    test('getOrElse debe retornar default si es fallido', () => {
      const result = Result.fail('error');
      expect(result.getOrElse('default')).toBe('default');
    });

    test('getOrThrow debe retornar valor si es exitoso', () => {
      const result = Result.ok('value');
      expect(result.getOrThrow()).toBe('value');
    });

    test('getOrThrow debe lanzar error si es fallido', () => {
      const result = Result.fail('error message');
      expect(() => result.getOrThrow()).toThrow('error message');
    });
  });
});
