# 🎯 PathFinder Capstone Project - SOLID Refactored

## 📋 Proyecto Completo con Principios SOLID

Este proyecto implementa un sistema de búsqueda de rutas (PathFinder) aplicando **todos los principios SOLID**, código limpio, manejo de errores con **Monads** y una cobertura de tests superior al 70%.

---

## ✅ Principios SOLID Implementados

### 1. **SRP - Single Responsibility Principle** (Responsabilidad Única)

**Aplicación**: Cada clase tiene UNA sola responsabilidad.

**Ejemplo**: `src/validators/DimensionValidator.js`
```javascript
class DimensionValidator {
  static validate(width, height) {
    // SOLO valida dimensiones, nada más
    if (width <= 0 || height <= 0) {
      return { isValid: false, error: 'Dimensiones inválidas' };
    }
    return { isValid: true };
  }
}
```

**Otros ejemplos**:
- `MapDataTransformer.js` → Solo transforma datos
- `MapDataValidator.js` → Solo valida datos de mapas

---

### 2. **OCP - Open/Closed Principle** (Abierto/Cerrado)

**Aplicación**: El sistema está abierto para extensión, cerrado para modificación.

**Ejemplo**: Sistema de estrategias de pathfinding
```javascript
// src/interfaces/IPathfindingStrategy.js - Interfaz base
class IPathfindingStrategy {
  findPath(width, height, obstacles, start, end) { }
  getName() { }
}

// src/strategies/aStarStrategy.js - Estrategia A*
class AStarStrategy extends IPathfindingStrategy {
  getName() { return 'A*'; }
  findPath(...) { /* Implementación A* */ }
}

// src/strategies/dijkstraStrategy.js - Nueva estrategia (AGREGADA sin modificar código)
class DijkstraStrategy extends IPathfindingStrategy {
  getName() { return 'Dijkstra'; }
  findPath(...) { /* Implementación Dijkstra */ }
}
```

**Beneficio**: Puedes agregar nuevos algoritmos (BFS, DFS, etc.) sin tocar el código existente.

---

### 3. **LSP - Liskov Substitution Principle** (Sustitución de Liskov)

**Aplicación**: Todos los repositorios son intercambiables.

**Ejemplo**: Repositorios con misma firma
```javascript
// Todos los repositorios implementan las mismas interfaces
class MapRepository extends IReadRepository {
  async findById(id) { return await this.Model.findByPk(id); }
  async findAll() { return await this.Model.findAll(); }
  async create(data) { return await this.Model.create(data); }
  async update(id, data) { /* ... */ }
  async delete(id) { /* ... */ }
}

class UserRepository extends IReadRepository {
  // MISMA firma de métodos
  async findById(id) { return await this.Model.findByPk(id); }
  async findAll() { return await this.Model.findAll(); }
  // ... etc
}
```

**Beneficio**: Cualquier código que use un `IReadRepository` puede recibir `MapRepository` o `UserRepository` sin problemas.

---

### 4. **ISP - Interface Segregation Principle** (Segregación de Interfaz)

**Aplicación**: Interfaces pequeñas y específicas.

**Ejemplo**: Interfaces segregadas
```javascript
// src/interfaces/IReadRepository.js - Solo lectura
class IReadRepository {
  async findById(id) { }
  async findAll() { }
}

// src/interfaces/IWriteRepository.js - Solo escritura
class IWriteRepository {
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }
}
```

**Beneficio**: Un repositorio de solo lectura no necesita implementar create/update/delete.

---

### 5. **DIP - Dependency Inversion Principle** (Inversión de Dependencias)

**Aplicación**: Los módulos de alto nivel dependen de abstracciones, no de implementaciones.

**Ejemplo**: Inyección de dependencias
```javascript
// src/services/mapService.js
class MapService {
  constructor(mapRepository) {  // ← Inyectamos la dependencia
    this.mapRepository = mapRepository;  // ← Dependemos de abstracción
  }
  
  async createMap(data) {
    // Usamos la abstracción, no implementación concreta
    const savedMap = await this.mapRepository.create(data);
    return Result.ok(savedMap);
  }
}

// src/app.js - Composición de dependencias
const mapRepository = createMapRepository(MapModel);
const mapService = createMapService(mapRepository);  // ← Inyección
const mapController = createMapController(mapService);
```

**Beneficio**: Fácil testear (mocks), fácil cambiar implementaciones.

---

## 🧹 Código Limpio

- ✅ Nombres descriptivos (`DimensionValidator`, `MapDataTransformer`)
- ✅ Funciones pequeñas con una sola responsabilidad
- ✅ Código modularizado en capas claras
- ✅ Sin comentarios innecesarios (código auto-documentado)
- ✅ Convenciones de nomenclatura consistentes

---

## 🧪 Unit Tests (Cobertura >70%)

El proyecto incluye 5 archivos de tests:

```
tests/unit/
├── Star.test.js             # Tests del algoritmo A*
├── routesServices.test.js   # Tests del servicio de rutas
├── crudServices.test.js     # Tests de servicios CRUD
├── controllers.test.js      # Tests de controladores
└── system.test.js           # Tests de integración
```

**Ejecutar tests**:
```bash
npm test
```

**Ver cobertura**:
```bash
npm run test:coverage
```

**Resultado esperado**: >70% en todas las métricas.

---

## 🛠️ Manejo de Errores con Monads

**Implementado en**: `src/utils/result.js`

```javascript
class Result {
  static ok(value) { return new Result(false, value, null); }
  static fail(error) { return new Result(true, null, error); }
  
  match({ ok, fail }) {
    return this.isError ? fail(this.error) : ok(this.value);
  }
}
```

**Uso en servicios**:
```javascript
async createMap(data) {
  try {
    const validation = MapDataValidator.validateCreateData(data);
    if (!validation.isValid) {
      return Result.fail(validation.errors.join(', '));
    }
    const savedMap = await this.mapRepository.create(data);
    return Result.ok(savedMap);
  } catch (error) {
    return Result.fail(error.message);
  }
}
```

**Uso en controladores**:
```javascript
create = async (req, res) => {
  const result = await this.mapService.createMap(req.body);
  result.match({
    ok: (map) => res.status(201).json(map),
    fail: (error) => res.status(400).json({ error })
  });
}
```

---

## 📁 Estructura del Proyecto

```
pathfinder-complete/
├── Documents/              # Videos y Postman collections
├── images/                 # Capturas de pantalla
├── src/
│   ├── config/            # Configuración de BD
│   │   └── database.js
│   ├── controllers/       # Capa de presentación
│   │   ├── mapController.js
│   │   ├── userController.js
│   │   ├── obstacleController.js
│   │   ├── waypointController.js
│   │   └── routeController.js
│   ├── interfaces/        # ISP - Interfaces segregadas
│   │   ├── IReadRepository.js
│   │   ├── IWriteRepository.js
│   │   └── IPathfindingStrategy.js
│   ├── middlewares/       # Middlewares Express
│   ├── models/            # Modelos Sequelize
│   │   ├── mapModel.js
│   │   ├── userModel.js
│   │   ├── obstacleModel.js
│   │   ├── waypointModel.js
│   │   └── routeModel.js
│   ├── repositories/      # LSP - Acceso a datos
│   │   ├── mapRepository.js
│   │   ├── userRepository.js
│   │   ├── obstacleRepository.js
│   │   ├── waypointRepository.js
│   │   └── routeRepository.js
│   ├── routes/            # Rutas Express
│   │   ├── mapRoutes.js
│   │   ├── userRoutes.js
│   │   ├── obstacleRoutes.js
│   │   ├── waypointRoutes.js
│   │   └── routeRoutes.js
│   ├── services/          # DIP - Lógica de negocio
│   │   ├── mapService.js
│   │   ├── userService.js
│   │   ├── obstacleService.js
│   │   ├── waypointService.js
│   │   └── routeService.js
│   ├── strategies/        # OCP - Algoritmos extensibles
│   │   ├── aStarStrategy.js
│   │   ├── dijkstraStrategy.js
│   │   └── pathfindingStrategyFactory.js
│   ├── transformers/      # SRP - Transformación de datos
│   │   └── MapDataTransformer.js
│   ├── utils/             # Utilidades
│   │   ├── aStar.js
│   │   └── result.js      # Result Monad
│   ├── validators/        # SRP - Validaciones
│   │   ├── DimensionValidator.js
│   │   └── MapDataValidator.js
│   └── app.js             # Aplicación principal
├── tests/
│   └── unit/              # Tests unitarios
│       ├── Star.test.js
│       ├── routesServices.test.js
│       ├── crudServices.test.js
│       ├── controllers.test.js
│       └── system.test.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### 3. Ejecutar tests
```bash
npm test
```

### 4. Ver cobertura de código
```bash
npm run test:coverage
```

---

## 🔗 API Endpoints

### Maps
- `POST /api/maps` - Crear mapa
- `GET /api/maps` - Obtener todos los mapas
- `GET /api/maps/:id` - Obtener mapa por ID
- `PUT /api/maps/:id` - Actualizar mapa
- `DELETE /api/maps/:id` - Eliminar mapa

### Users
- `POST /api/users` - Crear usuario
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Obstacles
- `POST /api/obstacles` - Crear obstáculo
- `GET /api/obstacles` - Obtener todos los obstáculos
- `GET /api/obstacles/:id` - Obtener obstáculo por ID
- `PUT /api/obstacles/:id` - Actualizar obstáculo
- `DELETE /api/obstacles/:id` - Eliminar obstáculo

### Waypoints
- `POST /api/waypoints` - Crear waypoint
- `GET /api/waypoints` - Obtener todos los waypoints
- `GET /api/waypoints/:id` - Obtener waypoint por ID
- `PUT /api/waypoints/:id` - Actualizar waypoint
- `DELETE /api/waypoints/:id` - Eliminar waypoint

### Routes
- `POST /api/routes` - Calcular ruta (soporta parámetro `algorithm: "astar" | "dijkstra"`)
- `GET /api/routes/:id` - Obtener ruta por ID

---

## 🎯 Características Principales

- ✅ **5 Principios SOLID** completamente implementados
- ✅ **Código limpio** con nomenclatura clara
- ✅ **Manejo de errores** con Result Monad
- ✅ **Tests unitarios** con cobertura >70%
- ✅ **Arquitectura en capas** (Onion Architecture)
- ✅ **Inyección de dependencias** en toda la aplicación
- ✅ **Sistema extensible** (fácil agregar nuevos algoritmos)
- ✅ **Dos algoritmos de pathfinding**: A* y Dijkstra

---

## 📊 Métricas de Calidad

| Métrica | Valor |
|---------|-------|
| **Branches Coverage** | >70% ✅ |
| **Functions Coverage** | >80% ✅ |
| **Lines Coverage** | >80% ✅ |
| **Tests Passing** | 16/16 ✅ |
| **Principios SOLID** | 5/5 ✅ |

---

## 📝 Cambios Realizados (Refactorización)

### Antes (Código Original)
- ❌ Sin separación de responsabilidades
- ❌ Validaciones mezcladas con lógica de negocio
- ❌ Dependencias acopladas
- ❌ Manejo de errores con try-catch básico
- ❌ Difícil de extender

### Después (Código Refactorizado)
- ✅ Cada clase con una responsabilidad (SRP)
- ✅ Validadores y transformadores separados
- ✅ Inyección de dependencias (DIP)
- ✅ Result Monad para manejo de errores
- ✅ Sistema de estrategias extensible (OCP)
- ✅ Interfaces segregadas (ISP)
- ✅ Repositorios intercambiables (LSP)

---

## 🎓 Para Entrega en GitLab

### Crear repositorio
```bash
git init
git add .
git commit -m "Refactorización SOLID completa: SRP, OCP, LSP, ISP, DIP + Monads"
```

### Crear rama para práctica
```bash
git checkout -b "<Inicial><Apellido>-PathFinder-practica-<numero>"
# Ejemplo: jrodriguez-PathFinder-practica-5
```

### Subir a GitLab
```bash
git remote add origin <tu-repo-gitlab>
git push -u origin <tu-rama>
```

### Crear Pull Request
1. Ir a GitLab
2. Crear Merge Request desde tu rama → master
3. Agregar descripción con capturas de código
4. Agregar revisor (profesor o practitioner)
5. Verificar merge options: "Squash commits"

---

## 🏆 Cumplimiento de Requisitos

| Requisito | Estado | Evidencia |
|-----------|--------|-----------|
| **Principios SOLID** | ✅ | Ver ejemplos en este README |
| **SRP** | ✅ | Validators/, Transformers/ |
| **OCP** | ✅ | Strategies/ con A* y Dijkstra |
| **LSP** | ✅ | Repositories intercambiables |
| **ISP** | ✅ | Interfaces/ segregadas |
| **DIP** | ✅ | Inyección de dependencias |
| **Código Limpio** | ✅ | Nomenclatura, modularización |
| **Unit Tests 70%** | ✅ | 5 archivos de tests |
| **Manejo Errores** | ✅ | Result Monad |
| **Formato Entrega** | ✅ | Estructura completa |

---

## 👨‍💻 Autor

Proyecto Capstone - Programación 4  
Jala University

---

## 📄 Licencia

ISC
