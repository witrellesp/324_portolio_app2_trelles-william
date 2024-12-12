import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3901;

var corsOptions = {
  origin: `http://localhost:5173`,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(express.json());
app.use(cors(corsOptions));
import { initDb, sequelize } from "./db/sequelize.mjs";

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie")
  )
  .catch((error) => {
    console.log(error);
    console.error("Impossible de se connecter à la DB");
  });

initDb();

// message affiché par défaut
app.get("/", (req, res) => {
  res.send("API REST pour visualier et noter des livres !");
});

// si /api/books/ alors envoi dans la route booksRouter
import { booksRouter } from "./routes/books.mjs";
app.use("/api/books", booksRouter);

// si /api/categories/ alors envoi dans la route categoriesRouter
import { categoriesRouter } from "./routes/categories.mjs";
app.use("/api/categories", categoriesRouter);

// si /api/authors/ alors envoi dans la route writersRouter
import { writersRouter } from "./routes/writers.mjs";
app.use("/api/authors", writersRouter);

// si /api/login/ alors envoi dans la route loginRouter
import { loginRouter } from "./routes/login.mjs";
app.use("/api/login", loginRouter);

// si /api/users/ alors envoi dans la route usersRouter
import { usersRouter } from "./routes/users.mjs";
app.use("/api/users", usersRouter);

// si /api/rates/ alors envoi dans la route ratesRouter
import { ratesRouter } from "./routes/rates.mjs";
app.use("/api/rates", ratesRouter);

// si /api/comments/ alors envoi dans la route commentsRouter
import { commentsRouter } from "./routes/comments.mjs";
app.use("/api/comments", commentsRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

// Si aucune route ne correspondant à l'URL demandée par le consommateur
app.use(({ req, res }) => {
  const message =
    "Impossible de trouver la ressource demandée, veuillez réesayer";
  res.status(404).json({ msg: message });
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
