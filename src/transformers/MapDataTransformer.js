
class MapDataTransformer {
  static toCreateDTO(data) {
    const width = data.dimensions?.width || data.width;
    const height = data.dimensions?.height || data.height;
    const obstacles = data.obstacles || data.obstaclesConfig || [];

    return {
      name: data.name,
      width: parseInt(width),
      height: parseInt(height),
      obstaclesConfig: obstacles
    };
  }

  static toUpdateDTO(data) {
    const updateData = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    const width = data.dimensions?.width || data.width;
    const height = data.dimensions?.height || data.height;

    if (width !== undefined) {
      updateData.width = parseInt(width);
    }

    if (height !== undefined) {
      updateData.height = parseInt(height);
    }

    if (data.obstacles !== undefined || data.obstaclesConfig !== undefined) {
      updateData.obstaclesConfig = data.obstacles || data.obstaclesConfig;
    }

    return updateData;
  }

  static toResponseDTO(map) {
    return {
      id: map.id,
      name: map.name,
      dimensions: {
        width: map.width,
        height: map.height
      },
      obstacles: map.obstaclesConfig
    };
  }
}

module.exports = MapDataTransformer;
