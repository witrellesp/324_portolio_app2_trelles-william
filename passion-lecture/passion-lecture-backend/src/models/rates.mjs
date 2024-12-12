const RateModel = (sequelize, DataTypes) => {
  const Rate = sequelize.define("Rate", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Utilisez uniquement des nombres pour le nombre de pages.",
        },
        notEmpty: {
          msg: "Le nombre de pages ne peut pas être vide.",
        },
        min: {
          args: [0.0],
          msg: "L'appreciation doit être supérieur ou égal à 0",
        },
        max: {
          args: [5.0],
          msg: "L'appreciation doit être inférieur ou égal à 5",
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
  Rate.associate = (models) => {
    Rate.belongsTo(models.Book, {
      foreignKey: "bookId",
    });

    Rate.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Rate;
};

export { RateModel };
