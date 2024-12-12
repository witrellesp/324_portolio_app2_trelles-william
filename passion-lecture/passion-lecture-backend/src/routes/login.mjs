import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";

const loginRouter = express();
loginRouter.post("/", (req, res) => {
  User.findOne({ where: { nickName: req.body.nickName } })
    .then((user) => {
      if (!user) {
        const message = `L'utilisateur demandé n'existe pas`;
        return res.status(404).json({ msg: message });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            const message = `Le mot de passe est incorrecte.`;
            return res.status(401).json({ msg: message });
          } else {
            // JWT
            const token = jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              privateKey,
              {
                expiresIn: "1y",
              }
            );
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ msg: message, data: user, token });
          }
        });
    })
    .catch((error) => {
      const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants`;
      return res.json({ msg: message, data: error });
    });
});
export { loginRouter };
