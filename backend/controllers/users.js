import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { createHash } from "../utils/hash.js";

export function getUsers(req, res) {
  return User.find({})
    .then((users) => {
      if (!users) {
        const err = new Error("Erro ao buscar usuários");
        err.status = 500;
        throw err;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      console.error("getUsers Error:", err);
      next(err);
    });
}

export function getUserById(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error("getUserById Error:", err);
      next(err);
    });
}

export function login(req, res) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password).then(({ user }) => {
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Email ou senha incorretos",
      });
    }

    return res.status(200).json({ data: {
      userId: user._id,
      token: jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      ),
    }});
  });
}

export function createUser(req, res) {
  const { name, about, avatar, email, password } = req.body;
  const hashedPassword = createHash(password);

  if (!email || !password) {
    return res.status(400).send({ error: "Dados inválidos..." });
  }

  return User.create({
    name,
    about,
    avatar,
    email,
    password: hashedPassword,
  })
    .then((user) => {
      if (!user) {
        const err = new Error("Ocorreu um erro ao criar usuário");
        err.status = 500;
        throw err;
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      console.error("createUser Error:", err);
      next(err);
    });
}

export function updateUserProfile(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;
  const userUpdated = {};

  if (name) {
    userUpdated.name = name;
  }
  if (about) {
    userUpdated.about = about;
  }

  if (!name && !about) {
    return res.status(400).send({ error: "Dados inválidos..." });
  }

  return User.findByIdAndUpdate(userId, userUpdated, {
    new: true,
  })
    .orFail(() => {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error("updateUserProfile Error:", err);
      next(err);
    });
}

export function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!avatar) {
    return res.status(400).send({ error: "Dados inválidos..." });
  }

  return User.findByIdAndUpdate(
    userId,
    {
      $set: { avatar: avatar.avatar }, // Use $set para campos únicos
    },
    {
      new: true,
    }
  )
    .orFail(() => {
      const err = new Error("Usuário não encontrado");
      err.status = 404;
      throw err;
    })
    .then((user) => {
      return res.send({ data: user });
    })
    .catch((err) => {
      console.error("updateUserAvatar Error:", err);
      next(err);
    });
}
