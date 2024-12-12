import express from "express";
import { Book, Writer } from "../db/sequelize.mjs";
import { authAdmin } from "../auth/authAdmin.mjs";
import { authVer } from "../auth/authVer.mjs";

const writersRouter = express();

//GET pour acceder a tous les écrivains
writersRouter.get("/", authVer, async (req, res) => {
  try {
    const writers = await Writer.findAll({ order: ["firstName"] });
    const message = "La liste des écrivains a bien été récupérée.";
    res.json({ msg: message, data: writers });
  } catch (error) {
    const message =
      "La liste des écrivains n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET acceder à un écrivain par id
writersRouter.get("/:id", authVer, async (req, res) => {
  const writerId = req.params.id;
  const writer = await Writer.findByPk(writerId);
  try {
    if (!writer) {
      const message =
        "L'écrivain demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const message = `La categorie dont l'id est ${writerId} a été bien récuperé`;
    res.json({ msg: message, data: writer });
  } catch (error) {
    const message =
      "La liste des écrivains n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET pour acceder aux écrivains par leur nom
writersRouter.get("/firstname/:name", authVer, async (req, res) => {
  const writerName = req.params.name;
  try {
    const writer = await Writer.findOne({ where: { firstName: writerName } });
    if (!writer) {
      const message = "L'écrivain demandée n'existe pas.";
      return res.status(404).json({ msg: message });
    }
    const message = `L'écrivain dont le nom est ${writerName} a été bien récuperée`;
    res.json({ msg: message, data: writer });
  } catch (error) {
    const message =
      "La liste des écrivains n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET trouve les livres qui appartient à un écrivain
writersRouter.get("/:id/books", authVer, async (req, res) => {
  const writerId = req.params.id;
  const writer = await Book.findByPk(writerId);
  try {
    if (!writer) {
      const message =
        "L'écrivain demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }

    const newWriter = await Book.findAll({ where: { writerId: writerId } });
    try {
      const message = `La liste des livres de l'écrivain dont l'id vaut ${writerId} a bien été récupérée.`;
      res.json({ msg: message, data: newWriter });
    } catch (error) {
      const message =
        "Les livres de l'écrivain n'ont pas pu être récupérés. Merci de réessayer dans quelques instants.";
      res.status(500).json({ msg: message, data: error });
    }
  } catch (error) {
    const message =
      "L'écrivain n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//POST ajouter un écrivain
writersRouter.post("/", authAdmin, async (req, res) => {
  try {
    const newWriter = await Writer.create(req.body);
    const message = `L'écrivain dont l'id est ${newWriter.id} a été bien créé`;
    res.json({ msg: message, data: newWriter });
  } catch (error) {
    const message = "Erreur lors de la création de l'écrivain.";
    res.status(500).json({ msg: message });
  }
});

//PUT modifier un écrivain
writersRouter.put("/:id", authAdmin, async (req, res) => {
  const writerId = req.params.id;
  const data = { ...req.body };
  try {
    const updatedWriter = await Writer.findByPk(writerId);
    if (!updatedWriter) {
      const message = "L'écrivain non trouvée.";
      return res.status(404).json({ msg: message });
    }
    const [updateWriter] = await Writer.update(data, {
      where: { id: writerId },
    });
    if (updateWriter === 0) {
      const message = "Aucune modification n'a été apportée à l'écrivain.";
      return res.status(404).json({ msg: message });
    }

    const message = `L'écrivain avec l'id ${updatedWriter.id} a été mis à jour avec succès et actuellement est ${updatedWriter.firstName}`;
    res.status(200).json({ msg: message, data: updatedWriter });
  } catch (error) {
    const message = "Erreur lors de la modification de l'écrivain.";
    res.status(500).json({ msg: message });
  }
});

//DELETE supprimer un écrivain par id
writersRouter.delete("/:id", authAdmin, async (req, res) => {
  const writerId = req.params.id;
  try {
    const deletedWriter = await Writer.findByPk(writerId);
    if (!deletedWriter) {
      const message =
        "L'écrivain demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const deleteWriter = await Writer.destroy({
      where: { id: writerId },
    });
    if (deleteWriter === 0) {
      const message = "Aucun écrivain n'a été supprimé.";
      return res.status(404).json({ msg: message });
    }
    const message = `L'écrivain ${deletedWriter.firstName} a bien été supprimé`;
    return res.json({ msg: message, data: deletedWriter });
  } catch (error) {
    const message =
      "L'écrivain n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message });
  }
});

export { writersRouter };
