const connection = require("./db");

const getKnights = (req, res) => {
  const initialSql = "select * from knight";
  const where = [];

  if (req.query.name_contain != null) {
    where.push({
      column: "name",
      value: `%${req.query.name_contain}%`,
      operator: "like",
    });
  }
  if (req.query.max_age != null) {
    where.push({
      column: "age",
      value: req.query.max_age,
      operator: "<=",
    });
  }

  connection
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([knights]) => {
      console.log(knights);
      res.json(knights);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Serveur SQL en PLS");
    });
};

const getKnightById = (req, res) => {
  const { id } = req.params;
  connection
    .query("SELECT * FROM knight WHERE id = ?", [id])
    .then(([knights]) => {
      if (knights[0] != null) res.json(knights[0]);
      else res.status(404).send("Knight not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Serveur SQL en PLS");
    });
};

const addKnight = (req, res) => {
  const { name, age, is_dubbed } = req.body;

  connection
    .query("INSERT INTO knight (name, age, is_dubbed) VALUES (?,?,?)", [
      name,
      age,
      is_dubbed,
    ])
    .then(([result]) => {
      res.location(`/api/knights/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Serveur SQL en PLS");
    });
};

const updateKnightById = (req, res) => {
  const { id } = req.params;
  connection
    .query("UPDATE knight SET ? WHERE id = ?", [req.body, id])
    .then(([result]) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Serveur SQL en PLS");
    });
};

const deleteKnightById = (req, res) => {
  const { id } = req.params;
  connection
    .query("DELETE FROM knight WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) res.status(404).send("Knight not found");
      else res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Serveur SQL en PLS");
    });
};

module.exports = {
  getKnights,
  getKnightById,
  addKnight,
  updateKnightById,
  deleteKnightById,
};
