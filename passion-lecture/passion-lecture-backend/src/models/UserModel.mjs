const UserModel = (sequelize, Datatypes) => {
  const User = sequelize.define("User", {
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le prénom de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "Le prénom de l'utilisateur est une propriété obligatoire.",
        },
        len: {
          args: [0, 45],
          msg: "Le prénom de l'utilisateur doit contenir au maximum 45 caractères.",
        },
      },
    },
    lastName: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le nom de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "Le nom de l'utilisateur est une propriété obligatoire.",
        },
        len: {
          args: [0, 35],
          msg: "Le nom de l'utilisateur doit contenir au maximum 35 caractères.",
        },
      },
    },
    nickName: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: {
        msg: "Ce pseudo est déjà utilisé.",
      },
      validate: {
        notEmpty: {
          msg: "Le pseudo de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "Le pseudo de l'utilisateur est une propriété obligatoire.",
        },
        len: {
          args: [0, 30],
          msg: "Le pseudo de l'utilisateur doit contenir au maximum 30 caractères.",
        },
      },
    },
    email: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: {
        msg: "Ce email est déjà utilisé.",
      },
      validate: {
        notEmpty: {
          msg: "L'email de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "L'email de l'utilisateur est une propriété obligatoire.",
        },
        len: {
          args: [0, 30],
          msg: "L'email de l'utilisateur doit contenir au maximum 30 caractères.",
        },
      },
    },
    password: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le mot de passe de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "Le mot de passe de l'utilisateur est une propriété obligatoire.",
        },
        len: {
          args: [0, 150],
          msg: "Le mot de passe de l'utilisateur doit contenir au maximum 200 caractères.",
        },
      },
    },
    dateEntry: {
      type: Datatypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La date d'entrée de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "La date d'entrée est une propriété obligatoire.",
        },
      },
    },
    isAdmin: {
      type: Datatypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La date d'entrée de l'utilisateur ne peut pas être vide.",
        },
        notNull: {
          msg: "La date d'entrée est une propriété obligatoire.",
        },
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Book, {
      foreignKey: "userId",
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
    });
    User.hasMany(models.Rate, {
      foreignKey: "userId",
    });
  };

  return User;
};

export { UserModel };
