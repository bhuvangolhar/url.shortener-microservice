import { type User, type InsertUser, type Url, type InsertUrl } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // URL shortening methods
  getUrlByShortCode(shortCode: string): Promise<Url | undefined>;
  getUrlByOriginalUrl(originalUrl: string): Promise<Url | undefined>;
  createUrl(url: InsertUrl & { shortCode: string }): Promise<Url>;
  getAllUrls(): Promise<Url[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private urls: Map<string, Url>;
  private urlsByOriginal: Map<string, Url>;

  constructor() {
    this.users = new Map();
    this.urls = new Map();
    this.urlsByOriginal = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUrlByShortCode(shortCode: string): Promise<Url | undefined> {
    return this.urls.get(shortCode);
  }

  async getUrlByOriginalUrl(originalUrl: string): Promise<Url | undefined> {
    return this.urlsByOriginal.get(originalUrl);
  }

  async createUrl(urlData: InsertUrl & { shortCode: string }): Promise<Url> {
    const id = randomUUID();
    const url: Url = {
      id,
      originalUrl: urlData.originalUrl,
      shortCode: urlData.shortCode,
      createdAt: new Date(),
    };
    
    this.urls.set(urlData.shortCode, url);
    this.urlsByOriginal.set(urlData.originalUrl, url);
    return url;
  }

  async getAllUrls(): Promise<Url[]> {
    return Array.from(this.urls.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();