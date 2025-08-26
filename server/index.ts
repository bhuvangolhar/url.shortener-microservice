import express from "express";
import bodyParser from "body-parser";
import dns from "dns";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory storage
let urls: { [key: number]: string } = {};
let counter = 1;

// POST endpoint
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  try {
    // Check valid URL
    const urlObj = new URL(originalUrl);

    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }

      // Save and respond
      urls[counter] = originalUrl;
      res.json({ original_url: originalUrl, short_url: counter });
      counter++;
    });
  } catch (e) {
    return res.json({ error: "invalid url" });
  }
});

// Redirect endpoint
app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const originalUrl = urls[id];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener Microservice 🚀");
});

app.listen(port, () => {
  console.log(`URL Shortener Microservice is running 🚀`);
});
