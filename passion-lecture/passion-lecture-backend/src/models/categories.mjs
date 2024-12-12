const CategoryModel = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z0-9\s]/,
          msg: "Seules les lettres, les chiffres et les espaces sont autorisées.",
        },
        notEmpty: {
          msg: "La categorie du livre ne peut pas être vide.",
        },
        len: {
          args: [0, 30],
          msg: "La categorie du livre doit contenir au maximum 30 caractères.",
        },
      },
    },
  });
  Category.associate = (models) => {
    Category.belongsToMany(models.Book, {
      through: "BookCategory",
      as: "books",
      foreignKey: "bookId",
      otherKey: "categoryId",
    });
  };
  return Category;
};
export { CategoryModel };
