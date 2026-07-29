import ApiError from '../errors/apiError.js';

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message }
    });
  }

  console.error(err); // erro inesperado: logamos para investigar depois
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' }
  });
}

export default errorHandler;
