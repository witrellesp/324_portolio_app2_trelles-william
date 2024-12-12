const WriterModel = (sequelize, DataTypes) => {
  const Writer = sequelize.define("Writer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z0-9\s]/,
          msg: "Seules les lettres et les espaces sont autorisées.",
        },
        notEmpty: {
          msg: "Le prénom de l'écrivain du livre ne peut pas être vide.",
        },
        notNull: {
          msg: "Le prénom de l'écrivain du livre est une propriété obligatoire.",
        },
        len: {
          args: [0, 45],
          msg: "Le prénom de l'écrivain du livre doit contenir au maximum 45 caractères.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z0-9\s]/,
          msg: "Seules les lettres et les espaces sont autorisées.",
        },
        notEmpty: {
          msg: "Le nom de l'écrivain du livre ne peut pas être vide.",
        },
        notNull: {
          msg: "Le nom de l'écrivain du livre est une propriété obligatoire.",
        },
        len: {
          args: [0, 35],
          msg: "Le nom de l'écrivain du livre doit contenir au maximum 35 caractères.",
        },
      },
    },
  });
  Writer.associate = (models) => {
    Writer.belongsToMany(models.Book, {
      through: "BookWriter",
      as: "books",
      foreignKey: "writerId",
      otherKey: "bookId",
    });
  };
  return Writer;
};
export { WriterModel };
