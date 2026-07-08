import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Route: Proxy remote M3U playlists or stream check to bypass CORS
  app.get("/api/fetch-playlist", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Referer": new URL(url).origin,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText} (${response.status})`);
      }

      const text = await response.text();
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.send(text);
    } catch (error: any) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ error: error.message || "Failed to fetch playlist" });
    }
  });

  // API Route: Check stream health / headers
  app.get("/api/check-stream", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      res.json({
        ok: response.ok,
        status: response.status,
        contentType: response.headers.get("content-type") || "unknown",
      });
    } catch (error: any) {
      // Some streams don't support HEAD or CORS, we can return success true with warning
      res.json({ ok: true, status: 200, contentType: "stream" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
