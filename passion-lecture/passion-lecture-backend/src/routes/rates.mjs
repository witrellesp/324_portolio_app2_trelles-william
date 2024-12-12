import express from "express";
import { Book, Rate, User } from "../db/sequelize.mjs";
import { authVer } from "../auth/authVer.mjs";
import { authRates } from "../auth/authRates.mjs";

const ratesRouter = express();

//GET pour acceder a tous les appréciations
ratesRouter.get("/", authVer, async (req, res) => {
  try {
    const rates = await Rate.findAll();
    const message = "La liste des appréciations a bien été récupérée.";
    res.json({ msg: message, data: rates });
  } catch (error) {
    const message =
      "La liste des appréciations n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET acceder à une appréciation par id
ratesRouter.get("/:id", authVer, async (req, res) => {
  const rateId = req.params.id;
  const rate = await Rate.findByPk(rateId);
  try {
    if (!rate) {
      const message =
        "L'appréciation demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const message = `La categorie dont l'id est ${rateId} a été bien récuperé`;
    res.json({ msg: message, data: rate });
  } catch (error) {
    const message =
      "L'appréciation n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//POST ajouter une appréciation
ratesRouter.post("/", authRates, async (req, res) => {
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
    const newRate = await Rate.create(req.body);
    const message = `L'appréciation dont l'id est ${newRate.id} a été bien créé`;
    res.json({ msg: message, data: newRate });
  } catch (error) {
    const message = "Erreur lors de la création de l'appréciation.";
    res.status(500).json({ msg: message });
  }
});

//PUT modifier une appréciation
ratesRouter.put("/:id", authRates, async (req, res) => {
  const { userId, bookId } = req.body;
  const rateId = req.params.id;
  const data = { ...req.body };

  try {
    // Validar existencia del libro
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
    const rate = await Rate.findByPk(rateId);
    if (!rate) {
      const message =
        "L'appréciation demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const [updateCount] = await Rate.update(data, { where: { id: rateId } });
    if (updateCount === 0) {
      const message = "Aucune modification n'a été apportée à l'appréciation.";
      return res.status(404).json({ msg: message });
    }

    const updatedRate = await Rate.findByPk(rateId);
    const message = `L'appréciation avec l'id ${updatedRate.id} a été mise à jour avec succès et actuellement vaut ${updatedRate.rating}`;
    res.json({ msg: message, data: updatedRate });
  } catch (error) {
    const message = "Erreur lors de la modification de l'appréciation.";
    res.status(500).json({ msg: message, data: error });
  }
});

//DELETE supprimer une appréciation
ratesRouter.delete("/:id", authRates, async (req, res) => {
  try {
    const rateId = req.params.id;
    const rate = await Rate.findByPk(rateId);
    if (!rate) {
      const message =
        "L'appréciation demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const deleteRate = await Rate.destroy({ where: { id: rateId } });
    if (deleteRate === 0) {
      const message = "Aucune appréciation n'a été supprimée.";
      return res.status(404).json({ msg: message });
    }
    const message = `L'appréciation a bien été supprimée.`;
    return res.json({ msg: message, data: rate }); // Proporcionar el ID del registro eliminado puede ser útil.
  } catch (error) {
    const message =
      "L'appréciation n'a pas pu être supprimée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

export { ratesRouter };
