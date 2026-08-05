import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory rate limiter for a long-running Node.js process
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 ads per minute per IP/Agent

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  // 1. Authentication
  const apiKey = req.headers["x-agent-api-key"];
  const expectedKey = process.env.AGENT_API_KEY;

  if (!expectedKey) {
    return res.status(500).json({ error: "Agent API Key is not configured on the server." });
  }

  if (apiKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  // 2. Rate Limiting
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too Many Requests. Please slow down." });
  }

  // 3. Process the payload
  try {
    const { email, name, description, price, condition, categorySlug, location, tags, images } = req.body;

    if (!email || !name || !categorySlug) {
      return res.status(400).json({ error: "Missing required fields: email, name, categorySlug" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found with the provided email." });
    }

    // Find category
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return res.status(404).json({ error: "Category not found with the provided slug." });
    }

    // Build Prisma Payload
    const adData: any = {
      userId: user.id,
      categoryId: category.id,
      name,
      description: description || "",
      price: price ? parseInt(price, 10) : 0,
      condition: condition || "NEW",
      location: location || "Unknown Location",
      canDeliver: false,
    };

    if (images && images.length > 0) {
      adData.images = {
        create: images.map((url: string) => ({ url })),
      };
    }

    if (tags && tags.length > 0) {
      adData.tags = {
        connectOrCreate: tags.map((t: string) => ({
          where: { name: t },
          create: { name: t }
        })),
      };
    }

    const newAd = await prisma.listing.create({
      data: adData,
    });

    return res.status(201).json({ success: true, listing: newAd });
  } catch (error: any) {
    console.error("Agent API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
