import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Verdict API
  app.post("/api/ai-verdict", async (req, res) => {
    const { painPoint, conditionName, description } = req.body;

    if (!painPoint) {
      return res.status(400).json({ error: "Pain point is required" });
    }

    try {
      const prompt = `You are a Senior Biomechanical Consultant for EZStep Clinical Orthotics, specializing in Spanish VOXELCARE engineering. 
      A patient is presenting with acute or chronic pain localized at the ${conditionName} (${description}).
      
      Tasks:
      1. Provide a precise clinical reasoning (3 sentences max) explaining the biomechanical pathophysiology.
      2. Detail how 3D-molded medical-grade EVA orthotics facilitate kinetic chain stabilization and pressure redistribution for this specific condition.
      3. Use authoritative, professional, and reassuring terminology.
      
      Constraint: Focus strictly on biomechanics and clinical alignment. Do not offer surgical advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ verdict: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate AI verdict" });
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
