function notFound(request, response) {
  response.status(404).json({
    message: "Endpoint nao encontrado."
  });
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const status = error && error.status ? error.status : 500;

  if (status >= 500) {
    console.error(error);
  }

  const payload = {
    message: status >= 500 ? "Erro interno do servidor." : error.message
  };

  if (status < 500 && error && error.details) {
    payload.details = error.details;
  }

  response.status(status).json(payload);
}

module.exports = {
  errorHandler,
  notFound
};

