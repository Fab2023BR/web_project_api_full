const errorHandler = (err, _req, res, _next) => {
  const { status = 500, message = "Ocorreu um erro no servidor" } = err;
  return res.status(status).send({
    message,
  });
};

export default errorHandler;
