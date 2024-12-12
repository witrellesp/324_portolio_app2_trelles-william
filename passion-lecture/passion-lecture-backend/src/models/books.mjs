const BookModel = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Ce titre est déjà utilisé.",
        },
        validate: {
          is: {
            args: /^[A-Za-z0-9\s]/,
            msg: "Seules les lettres, les chiffres et les espaces sont autorisées.",
          },
          notEmpty: {
            msg: "Le titre du livre ne peut pas être vide",
          },
          notNull: {
            msg: "Le titre du livre est une propriété obligatoire.",
          },
          len: {
            args: [0, 60],
            msg: "La titre du livre doit contenir au maximum 60 caractères.",
          },
        },
      },
      number_of_pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres pour le nombre de pages.",
          },
          notEmpty: {
            msg: "Le nombre de pages ne peut pas être vide.",
          },
          notNull: {
            msg: "Le nombre de pages est une propriété obligatoire",
          },
          min: {
            args: [10.0],
            msg: "Le nombre de pages doit être supérieur ou égal à 10 pages",
          },
          max: {
            args: [1000.0],
            msg: "Le nombre de pages doit être inférieur ou égal à 1000 pages",
          },
        },
      },
      excerpt: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Ce lien appartient déjà à un livre.",
        },
        validate: {
          notEmpty: {
            msg: "Le lien de l'extrait du livre ne peut pas être vide.",
          },
          notNull: {
            msg: "Le lien de l'extrait du livre est une propriété obligatoire",
          },
          len: {
            args: [0, 250],
            msg: "Le lien de l'extrait du livre doit contenir au maximum 250 caractères.",
          },
        },
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Ce résumé appartient déjà à un livre.",
        },
        validate: {
          is: {
            args: /^[A-Za-z0-9\s]/,
            msg: "Seules les lettres, les chiffres et les espaces sont autorisées.",
          },
          notEmpty: {
            msg: "Le résumé du livre ne peut pas être vide.",
          },
          notNull: {
            msg: "Le résumé du livre est une propriété obligatoire",
          },
          len: {
            args: [0, 500],
            msg: "Le résumé du livre doit contenir au maximum 500 caractères.",
          },
        },
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[A-Za-z0-9\s]/,
            msg: "Seules les lettres et les espaces sont autorisées.",
          },
          notEmpty: {
            msg: "L'éditeur du livre ne peut pas être vide.",
          },
          notNull: {
            msg: "L'éditeur du livre est une propriété obligatoire",
          },
          len: {
            args: [0, 50],
            msg: "L'éditeur du livre doit contenir au maximum 50 caractères.",
          },
        },
      },
      date_of_publication: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "L'année d'édition du livre ne peut pas être vide.",
          },
          notNull: {
            msg: "L'année d'édition est une propriété obligatoire",
          },
        },
      },
      book_cover: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Cette image de couverture est déjà utilisé.",
        },
        validate: {
          notNull: {
            msg: "L'image de couverture du livre est une propriété obligatoire",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres pour l'userId.",
          },
          notEmpty: {
            msg: "L'userId ne peut pas être vide.",
          },
          notNull: {
            msg: "L'userId est une propriété obligatoire",
          },
        },
      },
      writerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres pour le writerId.",
          },
          notEmpty: {
            msg: "Le writerId ne peut pas être vide.",
          },
          notNull: {
            msg: "Le writerId est une propriété obligatoire",
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres pour la categoryId.",
          },
          notEmpty: {
            msg: "La categoryId ne peut pas être vide.",
          },
          notNull: {
            msg: "La categoryId est une propriété obligatoire",
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );

  Book.associate = (models) => {
    Book.hasMany(models.Comment, {
      foreignKey: "bookId",
    });
    Book.hasMany(models.Rate, {
      foreignKey: "bookId",
    });
    Book.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Book.belongsToMany(models.Writer, {
      through: "BookWriter",
      as: "writers",
      foreignKey: "bookId",
      otherKey: "writerId",
    });

    Book.belongsToMany(models.Category, {
      through: "BookCategory",
      as: "categories",
      foreignKey: "bookId",
      otherKey: "categoryId",
    });
  };
  return Book;
};

export { BookModel };
