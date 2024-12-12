const CommentModel = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z0-9\s]/,
          msg: "Seules les lettres, les chiffres et les espaces sont autorisées.",
        },
        notEmpty: {
          msg: "Le commentaire du livre ne peut pas être vide.",
        },
        len: {
          args: [0, 300],
          msg: "Le commentaire du livre doit contenir au maximum 300 caractères.",
        },
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Utilisez uniquement des nombres pour le bookId.",
        },
        notEmpty: {
          msg: "Le bookId ne peut pas être vide.",
        },
        notNull: {
          msg: "Le bookId est une propriété obligatoire",
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
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.Book, {
      foreignKey: "bookId",
    });

    Comment.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Comment;
};
export { CommentModel };
