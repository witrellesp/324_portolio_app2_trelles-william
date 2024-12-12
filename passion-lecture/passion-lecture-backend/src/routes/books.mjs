import express from "express";
import {
  Book,
  User,
  Category,
  Writer,
  Rate,
  Comment,
} from "../db/sequelize.mjs";
import { authBooks } from "../auth/authBooks.mjs";
import { authVer } from "../auth/authVer.mjs";
const booksRouter = express();
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); //Nommage de l'image de couverture unique
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//GET pour acceder a tous les libres
booksRouter.get("/", authVer, async (req, res) => {
  try {
    const books = await Book.findAll(); //{ order: ["title"] }
    const message = "La liste des livres a bien été récupérée.";
    res.json({ msg: message, data: books });
  } catch (error) {
    const message =
      "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET pour acceder aux livres par l'id
booksRouter.get("/:id", authVer, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findByPk(bookId);
    if (book === null) {
      const message =
        "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const message = `Le livre dont l'id est ${bookId} a été bien récuperé`;
    res.json({ msg: message, data: book });
  } catch (error) {
    const message =
      "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET trouve les appréciations qui appartient à un livre
booksRouter.get("/:id/rates", authVer, async (req, res) => {
  const bookId = req.params.id;
  try {
    const rates = await Rate.findAll({ where: { bookId: bookId } });
    if (rates.length === 0) {
      const message = `Aucune appréciation trouvée pour le livre avec l'ID ${bookId}.`;
      return res.status(200).json({ msg: message });
    }
    const message = `La liste des appréciations pour le livre dont l'id vaut ${bookId} a bien été récupérée.`;
    res.json({ msg: message, data: rates });
  } catch (error) {
    const message =
      "Erreur lors de la récupération des appréciations. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//GET trouve les commentaires qui appartient à un livre
booksRouter.get("/:id/comments", authVer, async (req, res) => {
  const bookId = req.params.id;
  try {
    const comments = await Comment.findAll({ where: { bookId: bookId } });
    if (comments.length === 0) {
      const message = `Aucune appréciation trouvée pour le livre avec l'ID ${bookId}.`;
      return res.status(200).json({ msg: message });
    }
    const message = `La liste des appréciations pour le livre dont l'id vaut ${bookId} a bien été récupérée.`;
    res.json({ msg: message, data: comments });
  } catch (error) {
    const message =
      "Erreur lors de la récupération des appréciations. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

//POST ajouter un livre
booksRouter.post(
  "/",
  authVer,
  upload.single("book_cover"),
  async (req, res) => {
    const {
      title,
      number_of_pages,
      excerpt,
      summary,
      publisher,
      date_of_publication,
      userId,
      writerId,
      categoryId,
    } = req.body;

    try {
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        const message =
          "L'utilisateur n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ msg: message });
      }
      const writerExists = await Writer.findByPk(writerId);
      if (!writerExists) {
        const message =
          "L'écrivain n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ msg: message });
      }
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        const message =
          "La catégorie n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ msg: message });
      }

      let book_cover;
      if (req.file && req.file.filename) {
        book_cover = `http://localhost:3901/images/${req.file.filename}`;
      } else {
        book_cover = "http://localhost:3901/images/default.jpg";
      }

      const bookData = {
        title,
        number_of_pages,
        excerpt,
        summary,
        publisher,
        date_of_publication,
        book_cover: book_cover,
        userId,
        writerId,
        categoryId,
      };

      const createdBook = await Book.create(bookData);
      const message = `Le livre dont l'id est ${createdBook.id} a été bien créé`;
      res.json({
        msg: message,
        data: createdBook,
      });
    } catch (error) {
      const message =
        "Le livre n'a pas pu être créé. Merci de réessayer dans quelques instants.";
      res.status(500).json({
        msg: message,
        data: error.message,
      });
    }
  }
);
// Définir la route pour télécharger une image
booksRouter.post("/upload", upload.single("image"), (req, res) => {
  try {
    // Vérifiez si le fichier a été fourni
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    // Répondre avec les détails de l'image téléchargée
    res.status(200).json({
      message: "Image importée",
      filename: req.file.filename,
      url: `http://localhost:3901/images/${req.file.filename}`,
    });
  } catch (error) {
    // Gérer les erreurs inattendues
    console.error("Erreur lors de l'importation de l'image:", error);
    res.status(500).json({ error: "Erreur lors de l'importation de l'image" });
  }
});

booksRouter.post("/upload", upload.single("image"), (req, res) => {
  try {
    // Vérifiez si le fichier a été fourni
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    // Répondre avec les détails de l'image téléchargée
    res.status(200).json({
      message: "Image importée",
      filename: req.file.filename,
      url: `http://localhost:3901/images/${req.file.filename}`,
    });
  } catch (error) {
    // Gérer les erreurs inattendues
    console.error("Erreur lors de l'importation de l'image:", error);
    res.status(500).json({ error: "Erreur lors de l'importation de l'image" });
  }
});

//PUT modifier un livre
booksRouter.put(
  "/:id",
  authBooks,
  upload.single("book_cover"),

  async (req, res) => {
    const bookId = req.params.id;
    const {
      title,
      number_of_pages,
      excerpt,
      summary,
      publisher,
      date_of_publication,
      userId,
      writerId,
      categoryId,
    } = req.body;

    console.log("Data:", req.body);

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({
          msg: "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.",
        });
      }

      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({
          msg: "L'utilisateur n'existe pas. Merci de réessayer avec un autre identifiant.",
        });
      }

      const writerExists = await Writer.findByPk(writerId);
      if (!writerExists) {
        return res.status(404).json({
          msg: "L'écrivain n'existe pas. Merci de réessayer avec un autre identifiant.",
        });
      }

      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(404).json({
          msg: "La catégorie n'existe pas. Merci de réessayer avec un autre identifiant.",
        });
      }

      let book_cover;
      if (req.file && req.file.filename) {
        book_cover = `http://localhost:3901/images/${req.file.filename}`;
      } else {
        book_cover = book.book_cover;
      }

      const updateData = {
        title,
        number_of_pages,
        excerpt,
        summary,
        publisher,
        date_of_publication,
        book_cover: book_cover,
        userId,
        writerId,
        categoryId,
      };

      console.log("Data:", updateData);

      const [updatedRows] = await Book.update(updateData, {
        where: { id: bookId },
      });

      if (updatedRows === 0) {
        return res
          .status(404)
          .json({ msg: "Aucune modification n'a été apportée au livre." });
      }

      const updatedBook = await Book.findByPk(bookId);
      res.json({
        msg: "Le livre a été mis à jour avec succès",
        data: updatedBook,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Le livre n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.",
        data: error,
      });
    }
  }
);

//DELETE supprimer un livre par id
booksRouter.delete("/:id", authBooks, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (!book) {
      const message =
        "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ msg: message });
    }
    const deleteBook = await Book.destroy({ where: { id: bookId } });
    if (deleteBook === 0) {
      const message = "Aucun livre n'a été supprimé.";
      return res.status(404).json({ msg: message });
    }

    const message = `Le livre ${book.title} a bien été supprimé`;
    return res.json({ msg: message, data: { id: bookId } });
  } catch (error) {
    const message =
      "Le livre n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
    res.status(500).json({ msg: message, data: error });
  }
});

export { booksRouter };
