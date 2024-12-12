import { Sequelize, DataTypes } from "sequelize";
import { BookModel } from "../models/books.mjs";
import { UserModel } from "../models/UserModel.mjs";
import { CategoryModel } from "../models/categories.mjs";
import { WriterModel } from "../models/writers.mjs";
import { CommentModel } from "../models/comments.mjs";
import { RateModel } from "../models/rates.mjs";
import bcrypt from "bcrypt";

///////////////////////////////////////À changer une fois la base de données soit créé/////////////////
const sequelize = new Sequelize("db_Web295", "root", "root", {
  host: "localhost",
  port: "6033",
  dialect: "mysql",
  logging: false,
});

let initDb = async () => {
  try {
    await sequelize.sync({ force: true });
    await importUsers();
    await importWriters();
    await importCategories();
    await importBooks();
    await importComments();
    await importRates();
    console.log("La base de données db_Web295 a bien été synchronisée");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données :",
      error
    );
  }
};

//Modèle des livres
import { books } from "./mock-books.mjs";
const Book = BookModel(sequelize, DataTypes);
//Modèle des commentaires
import { comments } from "./mock-comments.mjs";
const Comment = CommentModel(sequelize, DataTypes);
//Modèle des appréciations
import { rates } from "./mock-rates.mjs";
const Rate = RateModel(sequelize, DataTypes);
//Modèle des categories
import { categories } from "./mock-categories.mjs";
const Category = CategoryModel(sequelize, DataTypes);
//Modèle des écrivants
import { writers } from "./mock-writers.mjs";
const Writer = WriterModel(sequelize, DataTypes);
//Modèle des utilisateurs
import { users } from "./mock-user.mjs";
const User = UserModel(sequelize, DataTypes);

const models = {
  Book,
  Comment,
  Rate,
  Category,
  Writer,
  User,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

//import tous les utilisateurs presents dans le fichier db/mock-users
const importUsers = async () => {
  for (const user of users) {
    try {
      const hash = await bcrypt.hash(user.password, 10); // temps pour hasher = du sel
      const createdUser = await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
        email: user.email,
        password: hash,
        dateEntry: user.dateEntry,
        isAdmin: user.isAdmin,
      });
      console.log("Utilisateur créé:", createdUser.toJSON());
    } catch (error) {
      console.error("Problème lors de la création de l'utilisateur:", error);
    }
  }
};

//import tous les categories presents dans le fichier db/mock-categories
const importCategories = async () => {
  for (const category of categories) {
    try {
      const createdCategory = await Category.create({
        name: category.name,
      });
      console.log("Catégorie créée:", createdCategory.toJSON());
    } catch (error) {
      console.error("Problème lors de la création de la catégorie:", error);
    }
  }
};

//import tous les écrivants presents dans le fichier db/mock-writers
const importWriters = async () => {
  for (const writer of writers) {
    try {
      const createdWriter = await Writer.create({
        firstName: writer.firstName,
        lastName: writer.lastName,
      });
      console.log("Écrivain créé:", createdWriter.toJSON());
    } catch (error) {
      console.error("Problème lors de la création de l'écrivain:", error);
    }
  }
};

//import tous les livres presents dans le fichier db/mock-book
const importBooks = async () => {
  for (const book of books) {
    if (!book.userId) {
      console.error("Le livre doit avoir un userId");
    }
    if (!book.categoryId) {
      console.error("Le livre doit avoir un categoryId");
    }
    if (!book.writerId) {
      console.error("Le livre doit avoir un writerId");
    }
    try {
      const user = await User.findByPk(book.userId);
      const category = await Category.findByPk(book.categoryId);
      const writer = await Writer.findByPk(book.writerId);

      const createdBook = await Book.create({
        title: book.title,
        number_of_pages: book.number_of_pages,
        excerpt: book.excerpt,
        summary: book.summary,
        writer: book.writer,
        publisher: book.publisher,
        date_of_publication: book.date_of_publication,
        comments: book.comments,
        book_cover: book.book_cover,
        userId: user.id,
        categoryId: category.id,
        writerId: writer.id,
      });
      console.log("Livre créé ou trouvé:", createdBook.toJSON());
    } catch (error) {
      console.error("Problème lors de la création du livre:", error);
    }
  }
};

//import tous les commentaires presents dans le fichier db/mock-comments
const importComments = async () => {
  for (const comment of comments) {
    if (!comment.userId) {
      console.error("Le commentaire doit avoir un userId");
    }
    if (!comment.bookId) {
      console.error("Le commentaire doit avoir un bookId");
    }
    try {
      const user = await User.findByPk(comment.userId);
      const book = await Book.findByPk(comment.bookId);

      if (!user) {
        console.error("L'utilisateur n'existe pas.", comment);
      }
      if (!book) {
        console.error("Le livre n'existe pas.");
      }

      const [createdComment, created] = await Comment.findOrCreate({
        where: {
          text: comment.text,
          userId: user.id,
          bookId: book.id,
        },
      });
      console.log("Commentaire créé ou trouvé:", createdComment.toJSON());
    } catch (error) {
      console.error("Problème lors de la création du commentaire:", error);
    }
  }
};

//import tous les appréciations presents dans le fichier db/mock-rates
const importRates = async () => {
  for (const rate of rates) {
    if (!rate.userId) {
      console.error("L'appréciation doit avoir un userId");
    }
    if (!rate.bookId) {
      console.error("L'appréciation doit avoir un bookId", rate);
    }
    try {
      const user = await User.findByPk(rate.userId);
      const book = await Book.findByPk(rate.bookId);

      if (!user) {
        console.error("L'utilisateur n'existe pas.");
      }
      if (!book) {
        console.error("Le livre n'existe pas.");
      }

      const [createdRate, created] = await Rate.findOrCreate({
        where: {
          rating: rate.rating,
          userId: user.id,
          bookId: book.id,
        },
      });
      console.log("Appréciation créée ou trouvée:", createdRate.toJSON());
    } catch (error) {
      console.error("Problème lors de la création de l'ppréciation:", error);
    }
  }
};

export { sequelize, initDb, Book, User, Category, Writer, Comment, Rate };
