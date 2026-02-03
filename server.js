const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données SQLite
// Sur Render, on utilise un chemin persistant pour ne pas perdre les données
const dbPath = path.resolve(__dirname, "moov_shop.db");
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(express.static(".")); // Sert ton fichier index.html

// Création de la table si elle n'existe pas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS store (id INTEGER PRIMARY KEY, content TEXT)");
});

// Route pour récupérer les données
app.get("/api/data", (req, res) => {
    db.get("SELECT content FROM store WHERE id = 1", (err, row) => {
        if (row) res.json(JSON.parse(row.content));
        else res.json(null);
    });
});

// Route pour sauvegarder les données
app.post("/api/save", (req, res) => {
    const data = JSON.stringify(req.body);
    db.run("INSERT OR REPLACE INTO store (id, content) VALUES (1, ?)", [data], (err) => {
        if (err) res.status(500).send(err);
        else res.json({ status: "success" });
    });
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
           
