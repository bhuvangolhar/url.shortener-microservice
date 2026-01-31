import { z } from "zod";

// Type definitions for user and URL data
export type User = {
  id: string;
  username: string;
  password: string;
};

export type Url = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
};

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertUrlSchema = z.object({
  originalUrl: z.string().url("Please provide a valid URL"),
});

export const shortenUrlSchema = z.object({
  url: z.string().url("Please provide a valid URL"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type ShortenUrlRequest = z.infer<typeof shortenUrlSchema>;