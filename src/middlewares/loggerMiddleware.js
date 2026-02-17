const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      logger.error('request failed', logData);
    } else {
      logger.info('request completed', logData);
    }
  });

  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error('error en la aplicacion', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body
  });

  res.status(err.status || 500).json({
    error: err.message || 'error interno del servidor'
  });
};

module.exports = {
  requestLogger,
  errorLogger
};
