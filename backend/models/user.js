import mongoose from "mongoose";
import validator from "validator";
import { validateHash } from "../utils/hash.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Formato do Email Inválido",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Explorer",
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "Link inválido",
    },
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return {
          statusCode: 401,
          message: "Email ou senha incorreto",
        };
      }
      return {
        validateHash: validateHash(password, user.password),
        user,
      };
    });
};

export default mongoose.model("user", userSchema);
