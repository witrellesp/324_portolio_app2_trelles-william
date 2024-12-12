import express from "express";
import { Book, User, Comment, Rate } from "../db/sequelize.mjs";
import { authVer } from "../auth/authVer.mjs";

const usersRouter = express();

//GET pour acceder a tous les users
usersRouter.get("/", authVer, async (req, res) => {
  const users = await User.findAll();
  try {
    const message = "La liste des utilisateurs a bien été récupérée.";
    res.json({ msg: message, data: users });
  } catch (error) {
    const message =
      "La liste des utilisateurs n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET pour acceder a un utilisateur en particulier depuis son id
usersRouter.get("/:id", authVer, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  try {
    if (!user) {
      const message =
        "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const message = `L'utilisateur dont l'id est ${userId} a été bien récuperé`;
    res.json({ msg: message, data: user });
  } catch (error) {
    // Message d'erreur
    const message =
      "L'utilisateur n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET pour acceder aux livres ajoutés par un utilisateur depuis l'Id de l'utilisateur
usersRouter.get("/:id/books", authVer, async (req, res) => {
  const userId = req.params.id;
  const user = await Book.findByPk(userId);
  try {
    if (!user) {
      const message =
        "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const books = await Book.findAll({ where: { userId: userId } });
    try {
      const message = `Les livres de l'utilisateur ${userId} ont bien été récupérés.`;
      res.json({ msg: message, data: books });
    } catch (error) {
      // Message d'erreur
      const message =
        "Les livres de l'utilisateur n'ont pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ msg: message, data: error });
    }
  } catch (error) {
    const message =
      "L'utilisateur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET pour acceder aux livres que l'utilisateurs a commenté
usersRouter.get("/:id/commentedbooks", authVer, async (req, res) => {
  const userId = req.params.id;
  try {
    const comments = await Comment.findAll({
      where: { userId: userId },
      attributes: ["bookId"],
    });
    if (comments.length === 0) {
      const message = `Aucun commentaire trouvé pour l'utilisateur avec l'ID ${userId}. Aucun livre à afficher.`;
      return res.status(404).json({ msg: message });
    }
    const bookIds = [...new Set(comments.map((comment) => comment.bookId))];
    const books = await Book.findAll({
      where: { id: bookIds },
    });

    const message = `Liste des livres commentés par l'utilisateur avec l'ID ${userId} récupérée avec succès.`;
    res.json({ msg: message, data: books });
  } catch (error) {
    const message =
      "Erreur lors de la récupération des livres. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET pour acceder aux livres que l'utilisateurs a ajouté une appéciation
usersRouter.get("/:id/ratedbooks", authVer, async (req, res) => {
  const userId = req.params.id;
  try {
    const rates = await Rate.findAll({
      where: { userId: userId },
      attributes: ["bookId"],
    });
    if (rates.length === 0) {
      const message = `Aucun commentaire trouvé pour l'utilisateur avec l'ID ${userId}. Aucun livre à afficher.`;
      return res.status(404).json({ msg: message });
    }
    const bookIds = [...new Set(rates.map((rate) => rate.bookId))];
    const books = await Book.findAll({
      where: { id: bookIds },
    });

    const message = `Liste des livres commentés par l'utilisateur avec l'ID ${userId} récupérée avec succès.`;
    res.json({ msg: message, data: books });
  } catch (error) {
    const message =
      "Erreur lors de la récupération des livres. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});
export { usersRouter };
