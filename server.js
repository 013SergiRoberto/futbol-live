const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ app: "Futbol Live", status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiFootballConfigured: Boolean(process.env.API_FOOTBALL_KEY)
  });
});

app.get("/api/live", async (req, res) => {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    return res.status(503).json({
      error: "Falta configurar la clave API en el servidor."
    });
  }

  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      { headers: { "x-apisports-key": key } }
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Error de API-Football",
        details: data.errors || {}
      });
    }

    res.json(data);
  } catch (error) {
    res.status(502).json({
      error: "No se pudo contactar con API-Football."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Futbol Live API escuchando en ${port}`)
);
