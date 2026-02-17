const logger = require('../utils/logger');

const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  const memoryBefore = process.memoryUsage();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const memoryAfter = process.memoryUsage();
    
    const memoryDelta = {
      rss: memoryAfter.rss - memoryBefore.rss,
      heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
      heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed
    };

    if (duration > 5000) {
      logger.warn('posible cuello de botella detectado', {
        url: req.url,
        method: req.method,
        duration: `${duration}ms`,
        memoryDelta
      });
    }

    if (memoryDelta.heapUsed > 50 * 1024 * 1024) {
      logger.warn('posible fuga de memoria detectada', {
        url: req.url,
        method: req.method,
        memoryIncrease: `${Math.round(memoryDelta.heapUsed / 1024 / 1024)}MB`
      });
    }

    if (duration < 5000 && memoryDelta.heapUsed < 50 * 1024 * 1024) {
      logger.info('analisis de rendimiento completado', {
        url: req.url,
        duration: `${duration}ms`,
        message: 'sin fugas de memoria ni cuellos de botella detectados'
      });
    }
  });

  next();
};

module.exports = performanceMonitor;
