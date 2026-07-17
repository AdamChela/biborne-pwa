const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  const ip = Object.values(os.networkInterfaces()).flat().find(i => i.family === "IPv4" && !i.internal)?.address || "localhost";
  console.log(`Biborne PWA demarree sur http://localhost:${PORT}`);
  console.log(`Sur mobile (meme WiFi) : http://${ip}:${PORT}`);
});
