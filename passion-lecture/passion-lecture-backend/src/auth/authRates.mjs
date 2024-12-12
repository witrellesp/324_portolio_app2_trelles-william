import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";
import { Rate } from "../db/sequelize.mjs";

const authRates = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const message = `Vous n'avez par fourni de jeton d'authentification. Ajoutez-en un dnas l'en tête de la requête.`;
    return res.status(401).json({ message });
  } else {
    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      privateKey,
      async (error, decodedToken) => {
        if (error) {
          const message = `L'utilisateur n'est pas autorisé à accéder à cette resource.`;
          return res.status(401).json({ message, data: error });
        }
        const userId = decodedToken.userId;

        // Un moyen de transmettre le user id pour l'utiliser dans la route
        res.locals.userId = userId;
        const isAdmin = decodedToken.isAdmin;

        // Un utilisateur ne peut modifier que ses livres
        // Un utilisateur ne peut supprimer que ses livres
        if (["PUT", "DELETE"].includes(req.method)) {
          console.log(req.method);
          const rateId = req.params.id;
          const rate = await Rate.findByPk(rateId);

          console.log(`Est ce que ce user est admin ? ${isAdmin}`);
          console.log(`ID USER du token : ${userId} `);
          console.log(`ID USER du rate : ${rate.userId} `);

          if (!isAdmin && rateId.userId !== userId) {
            const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
            return res.status(401).json({ message, data: error });
          }
        }
        console.log(req.body.userId);
        console.log(userId);
        //L'admin n'a pas besoin d'être la personne qui a post le livre
        if (!isAdmin && req.body.userId && req.body.userId !== userId) {
          const message = `L'identifiant de l'utisateur est invalide`;
          return res.status(401).json({ message });
        } else {
          next();
        }
      }
    );
  }
};

export { authRates };
