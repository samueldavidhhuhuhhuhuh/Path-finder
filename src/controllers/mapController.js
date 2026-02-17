/**
 * MapController con manejo de errores usando Result Monad
 */
class MapController {
  constructor(mapService) {
    this.mapService = mapService;
  }

  create = async (req, res) => {
    const result = await this.mapService.createMap(req.body);
    
    result.match({
      ok: (map) => res.status(201).json(map),
      fail: (error) => res.status(400).json({ error })
    });
  }

  getOne = async (req, res) => {
    const result = await this.mapService.getMapById(req.params.id);
    
    result.match({
      ok: (map) => res.status(200).json(map),
      fail: (error) => res.status(404).json({ error })
    });
  }

  getAll = async (req, res) => {
    const result = await this.mapService.getAllMaps();
    
    result.match({
      ok: (maps) => res.status(200).json(maps),
      fail: (error) => res.status(500).json({ error })
    });
  }

  update = async (req, res) => {
    const result = await this.mapService.updateMap(req.params.id, req.body);
    
    result.match({
      ok: (updatedMap) => res.status(200).json(updatedMap),
      fail: (error) => {
        const status = error.includes("no encontrado") ? 404 : 400;
        res.status(status).json({ error });
      }
    });
  }

  delete = async (req, res) => {
    const result = await this.mapService.deleteMap(req.params.id);
    
    result.match({
      ok: (response) => res.status(200).json(response),
      fail: (error) => res.status(404).json({ error })
    });
  }
}

const createMapController = (mapService) => new MapController(mapService);

module.exports = createMapController;
