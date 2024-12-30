import jwt from "jsonwebtoken";
const { JWT_SECRET = "dev-secret" } = process.env;

const extractBearerToken = (token) => {
  return token.replace("Bearer ", "");
};

export const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Autorização Necessária",
    });
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "Autorização Necessária",
    });
  }
  req.user = payload;
  next();
};
