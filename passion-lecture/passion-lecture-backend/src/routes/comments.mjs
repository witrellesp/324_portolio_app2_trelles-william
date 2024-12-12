import express from "express";
import { Book, Comment, User } from "../db/sequelize.mjs";
import { authVer } from "../auth/authVer.mjs";
import { authComments } from "../auth/authComments.mjs";

const commentsRouter = express();

//GET pour acceder a tous les commentaires
commentsRouter.get("/", authVer, async (req, res) => {
  try {
    const comments = await Comment.findAll();
    const message = "La liste des commentaires a bien été récupérée.";
    res.json({ msg: message, data: comments });
  } catch (error) {
    const message =
      "La liste des commentaires n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET acceder à une commentaires par id
commentsRouter.get("/:id", authVer, async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findByPk(commentId);
  try {
    if (!comment) {
      const message =
        "Le commentaire demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const message = `Le commentaire dont l'id est ${commentId} a été bien récuperé`;
    res.json({ msg: message, data: comment });
  } catch (error) {
    const message =
      "Le commentaire n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//POST ajouter un commentaire
commentsRouter.post("/", authComments, async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      const message =
        "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      const message =
        "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const newComment = await Comment.create(req.body);
    const message = `Le commentaire dont l'id est ${newComment.id} a été bien créé`;
    res.json({ msg: message, data: newComment });
  } catch (error) {
    const message = "Erreur lors de la création de le commentaire.";
    res.status(500).json({ msg: message });
  }
});

//PUT modifier un commentaire
commentsRouter.put("/:id", authComments, async (req, res) => {
  const { userId, bookId } = req.body;
  const commentId = req.params.id;
  const data = { ...req.body };
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      const message =
        "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      const message =
        "L'utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      const message =
        "Le commentaire demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }

    const [updateCount] = await Comment.update(data, {
      where: { id: commentId },
    });
    if (updateCount === 0) {
      const message = "Aucune modification n'a été apportée au commentaire.";
      return res.status(404).json({ msg: message });
    }

    const updatedComment = await Comment.findByPk(commentId);
    const message = `Le commentaire avec l'id ${updatedComment.id} a été mis à jour avec succès et actuellement est ${updatedComment.text}`;
    res.json({ msg: message, data: updatedComment });
  } catch (error) {
    const message = "Erreur lors de la modification du commentaire.";
    res.status(500).json({ msg: message, data: error });
  }
});

//DELETE supprimer un commentaire
commentsRouter.delete("/:id", authComments, async (req, res) => {
  try {
    const commentId = req.params.id;
    const deleteComment = await Comment.findByPk(commentId);
    if (!deleteComment) {
      const message =
        "Le commenaire demandé n'existe pas. Merci de réesayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const deletedComment = await Comment.destroy({ where: { id: commentId } });
    if (deletedComment === 0) {
      const message = "Aucun commentaire n'a été supprimé.";
      return res.status(404).json({ msg: message });
    }
    const message = `Le commentaire ${deleteComment.text} a bien été supprimé`;
    return res.json({ msg: message, data: deleteComment });
  } catch (error) {
    const message =
      "L'appréciation n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500), json({ msg: message, data: error });
  }
});

export { commentsRouter };
