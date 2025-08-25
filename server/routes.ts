import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { shortenUrlSchema } from "@shared/schema";
import { z } from "zod";

// Generate random short code
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/shorten - Shorten a URL
  app.post("/api/shorten", async (req, res) => {
    try {
      const { url } = shortenUrlSchema.parse(req.body);
      
      // Check if URL already exists
      const existingUrl = await storage.getUrlByOriginalUrl(url);
      if (existingUrl) {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}`
          : 'http://localhost:5000';
        
        return res.json({
          shortUrl: `${baseUrl}/${existingUrl.shortCode}`,
          originalUrl: existingUrl.originalUrl,
          shortCode: existingUrl.shortCode,
          createdAt: existingUrl.createdAt.toISOString(),
        });
      }
      
      // Generate unique short code
      let shortCode: string;
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        attempts++;
        if (attempts > 10) {
          return res.status(500).json({
            error: "Unable to generate unique short code",
            message: "Please try again later"
          });
        }
      } while (await storage.getUrlByShortCode(shortCode));
      
      // Create new shortened URL
      const newUrl = await storage.createUrl({
        originalUrl: url,
        shortCode,
      });
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}`
        : 'http://localhost:5000';
      
      res.json({
        shortUrl: `${baseUrl}/${newUrl.shortCode}`,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        createdAt: newUrl.createdAt.toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid URL format",
          message: error.errors[0]?.message || "Please provide a valid URL"
        });
      }
      
      console.error("Error shortening URL:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Unable to shorten URL"
      });
    }
  });

  // GET /api/urls - Get all URLs for recent URLs display
  app.get("/api/urls", async (req, res) => {
    try {
      const urls = await storage.getAllUrls();
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}`
        : 'http://localhost:5000';
      
      const urlsWithShortUrl = urls.map(url => ({
        ...url,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        createdAt: url.createdAt.toISOString(),
      }));
      
      res.json(urlsWithShortUrl);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Unable to fetch URLs"
      });
    }
  });

  // GET /:shortCode - Redirect to original URL
  app.get("/:shortCode", async (req, res) => {
    try {
      const { shortCode } = req.params;
      
      // Skip API routes and static assets
      if (shortCode.startsWith('api') || shortCode.includes('.') || shortCode.startsWith('src')) {
        return res.status(404).json({
          error: "Short URL not found",
          message: "The requested short code does not exist"
        });
      }
      
      const url = await storage.getUrlByShortCode(shortCode);
      if (!url) {
        return res.status(404).json({
          error: "Short URL not found",
          message: "The requested short code does not exist"
        });
      }
      
      // Use 302 (temporary redirect) as URLs might change
      res.redirect(302, url.originalUrl);
    } catch (error) {
      console.error("Error redirecting URL:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Unable to redirect URL"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
