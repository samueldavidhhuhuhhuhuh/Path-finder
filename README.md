# pathfinder capstone - solid

sistema de busqueda de rutas con principios solid, codigo limpio y 85% cobertura.

## cumplimiento

- principios solid: 5/5
- codigo limpio: completo
- tests >70%: 85% (161 tests)
- manejo errores: result monad
- validaciones avanzadas: 13 funcionalidades

## solid aplicado

### 1. srp - responsabilidad unica
cada clase hace una sola cosa.
- `DimensionValidator.js` - solo valida dimensiones
- `MapDataTransformer.js` - solo transforma datos

### 2. ocp - abierto/cerrado
agregar funcionalidad sin modificar codigo existente.
- dijkstra agregado sin tocar codigo anterior
- factory permite registrar nuevos algoritmos

### 3. lsp - sustitucion liskov
repositorios intercambiables con misma firma.
- todos tienen: findById, findAll, create, update, delete

### 4. isp - segregacion interfaz
interfaces pequenas y especificas.
- `IReadRepository` - solo lectura
- `IWriteRepository` - solo escritura

### 5. dip - inversion dependencias
servicios reciben dependencias inyectadas.
```javascript
constructor(mapRepository) {
  this.mapRepository = mapRepository;
}
```

## manejo errores monad

```javascript

return Result.ok(data);
return Result.fail('error');


result.match({
  ok: (data) => res.json(data),
  fail: (error) => res.status(400).json({ error })
});
```

## cobertura

```
statements:  85.14%
branches:    80.99%
functions:   73.95%
lines:       85.20%
tests:       161 passed
```

## estructura

```
src/
├── interfaces/        isp (3 archivos)
├── validators/        srp (4 archivos)
├── transformers/      srp (1 archivo)
├── strategies/        ocp (3 archivos)
├── services/          dip (5 archivos)
├── repositories/      lsp (5 archivos)
├── controllers/       (6 archivos)
├── middlewares/       (3 archivos - logging y validacion)
├── models/            (5 archivos)
└── routes/            (6 archivos)
```

## uso

```bash
npm install
npm test
npm start
```

## endpoints principales

```
POST   /api/maps
POST   /api/routes    { mapId, start, end, algorithm: "astar" }
GET    /api/validate/*   (10 endpoints de validacion)
```

algoritmos: `"astar"` o `"dijkstra"`

## funcionalidades avanzadas

- validacion uuid con recursion
- deteccion ciclos con dfs
- monitoreo rendimiento automatico
- logging con winston (logs/combined.log)
- validaciones de 13 casos edge

## cambios

**antes**: sin solid, validaciones mezcladas, 52-69% cobertura
**despues**: 5 solid, codigo limpio, 80-85% cobertura, 13 validaciones avanzadas