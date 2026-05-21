import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

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

  // Customer Support Chatbot API
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    try {
      const systemInstruction = `You are the EZStep Clinical AI Assistant, a professional and reassuring expert in biomechanical alignment and custom orthotics.
      
      EZSTEP KNOWLEDGE BASE:
      - Clinics: 
        1. One Ayala (Ayala Malls, 3/L) - +63 995 032 2139
        2. SM Mall of Asia (North Entertainment Mall, 2/L) - +63 926 969 6758
        3. SM North Annex (Quezon City, 2/L) - +63 995 032 2139
      - Booking: Free clinical scans and assessments are available at all branches. Appointments can be booked via our website or via phone. All branches are open 11 AM - 9 PM daily.
      - Manufacturing: Custom insoles are manufactured in 3-5 business days using the Spanish VOXELCARE 3D platform.
      - Bio-markers: We treat Plantar Fasciitis, Flat Feet, Diabetic Foot, and general gait misalignment.
      - Durability: Recalibration is recommended every 12-18 months.
      
      TONE: Professional, medical-grade, helpful, and concise. Always guide the user towards a free clinical assessment if they mention pain.
      
      RESPONSE FORMAT: Keep responses under 3 paragraphs. Use bullet points for lists.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          ...messages.map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }]
          }))
        ]
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Chatbot Error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // AI Orthotic Adjustments Suggestion
  app.post("/api/orthotic-suggestions", async (req, res) => {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    try {
      const prompt = `You are a Senior Orthotic Laboratory Engineer at EZStep Clinical. 
      Analyze the following patient pain description and provide exactly 3 specific orthotic adjustments (e.g., heel lift, arch stiffening, metatarsal bars).
      
      Patient Description: "${description}"
      
      Requirements:
      1. Technical precision (mention specific levels, e.g., 4mm, 55 Shore A density).
      2. Relate each adjustment directly to the symptom.
      3. Use professional, clinical terminology.
      
      Format: Return ONLY a Markdown list of 3 bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ suggestions: response.text });
    } catch (error) {
      console.error("Suggestions Error:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  // Booking Automation & Upsell API
  app.post("/api/book-appointment", async (req, res) => {
    const { name, email, phone, branchName, date, time } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    try {
      const prompt = `Predict a personalized orthopedic product recommendation for a new patient who just booked an assessment.
      Patient Name: ${name}
      Location: ${branchName}
      
      Generate a short, persuasive "Up-selling" message (under 100 words) that:
      1. Thanks them for booking.
      2. Mentions a specific high-end product (e.g., EZStep Carbon Fiber Pro, Medical Grade Foot Alignment Sandals).
      3. Explain why it complements their upcoming Voxel Scan.
      
      Also, return a JSON object with:
      - suggestedProduct: string
      - upsellMessage: string
      - discountCode: string (generate a 10% off code)
      
      Format your response as a JSON string.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const responseData = JSON.parse(response.text);

      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "EZStep Clinical - Assessment Confirmed",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
              <h2 style="color: #0f172a; text-transform: uppercase;">Assessment Scheduled</h2>
              <p>Hello ${name}, your bio-orthopedic assessment has been successfully logged.</p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin: 24px 0;">
                <h3 style="margin-top: 0; color: #020617; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Schedule Details</h3>
                <p style="margin: 4px 0;"><strong>Branch:</strong> ${branchName}</p>
                <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
              </div>

              <div style="margin: 24px 0;">
                <h3 style="color: #020617; font-size: 14px; text-transform: uppercase;">A Message from our Engineers</h3>
                <p style="font-size: 14px; line-height: 1.6;">${responseData.upsellMessage}</p>
                <p style="margin: 20px 0;"><strong>Product Suggestion:</strong> ${responseData.suggestedProduct}</p>
                <p style="font-weight: bold; color: #0062ff;">Use code ${responseData.discountCode} for 10% off at the clinic.</p>
              </div>

              <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px;">
                Clinical Reference: SYN-${Math.random().toString(36).substring(7).toUpperCase()}
              </p>
            </div>
          `
        });
        console.log(`[AUTOMATION] Booking email sent to ${email}`);
      } else {
        console.warn("[AUTOMATION] RESEND_API_KEY missing, skipping email sending");
      }

      res.json({ 
        success: true, 
        upsell: responseData 
      });
    } catch (error) {
      console.error("Automation Error:", error);
      res.status(500).json({ error: "Failed to process booking automation" });
    }
  });

  // AI Gait Analysis API
  app.post("/api/gait-analysis", async (req, res) => {
    const { conditionId, isCorrected } = req.body;

    if (!conditionId) {
      return res.status(400).json({ error: "Condition ID is required" });
    }

    try {
      const prompt = `You are a Clinical Gait Specialist at EZStep. 
      Analyze the ${isCorrected ? 'CORRECTED (Orthotic-supported)' : 'NATURAL (Unsupported)'} pressure map for a patient with ${conditionId.toUpperCase()}.
      
      Describe the kinetic implications:
      1. What does this pressure distribution mean for the joints?
      2. How does the current state affect long-term mobility?
      3. ${isCorrected ? 'How effective is the correction?' : 'What risks exist without correction?'}
      
      Requirements: Keep it under 80 words. Be professional and authoritative.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error) {
      console.error("Gait Analysis Error:", error);
      res.status(500).json({ error: "Failed to generate gait analysis" });
    }
  });

  // Text-To-Speech API using Gemini
  app.post("/api/tts", async (req, res) => {
    const { text, voice = 'Kore' } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Read this clinical analysis clearly: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice as any },
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!audioData) {
        throw new Error("No audio data returned from Gemini");
      }

      res.json({ audioData });
    } catch (error) {
      console.error("TTS Error:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // Welcome Email for Registration
  app.post("/api/welcome-email", async (req, res) => {
    const { name, email } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    try {
      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Welcome to the EZStep Clinical Lab",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
              <h1 style="color: #0f172a; text-transform: uppercase; letter-spacing: -0.05em;">Welcome, ${name}!</h1>
              <p>Your biometric data synchronization is now active. You have successfully initialized your clinical account at EZStep.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin: 24px 0;">
                <h3 style="margin-top: 0; color: #020617;">Account Privileges:</h3>
                <ul style="padding-left: 20px;">
                  <li>Access to Patient Archive & Biometric Scans</li>
                  <li>Real-time appointment scheduling & rescheduling</li>
                  <li>Insole fabrication technical specifications</li>
                </ul>
              </div>
              <p>We look forward to helping you achieve perfect alignment.</p>
              <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px;">
                EZSTEP CLINICAL BIOMETRIC - The Future of Orthopedic Engineering
              </p>
            </div>
          `
        });
        console.log(`[AUTH] Welcome email sent to ${email}`);
      } else {
        console.warn("[AUTH] RESEND_API_KEY missing, skipping welcome email");
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Welcome Email Error:", error);
      res.status(500).json({ error: "Failed to send welcome email" });
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
