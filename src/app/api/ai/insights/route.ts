import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { projects } = await req.json();

    const projectSummary = projects.map((p: {
      title: string;
      status: string;
      priority: string;
      healthScore: number;
      stack: string[];
      updatedAt: string;
      description: string;
    }) => `
- ${p.title} (${p.status}, priority: ${p.priority}, health: ${p.healthScore}/100)
  Stack: ${p.stack.join(", ") || "none"}
  Last updated: ${new Date(p.updatedAt).toLocaleDateString()}
  Description: ${p.description || "none"}
    `.trim()).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" }); //Change model as needed based on your requirements and availability

    const prompt = `You are an AI assistant embedded in Nexus, a developer project operating system.
Analyze these projects and return a JSON response only — no markdown, no code blocks, no explanation, just raw JSON.

Projects:
${projectSummary}

Return this exact JSON structure:
{
  "summary": "2-3 sentence overall assessment of the developer's portfolio",
  "insights": [
    {
      "type": "warning or suggestion or success or info",
      "title": "short title",
      "body": "actionable insight in 1-2 sentences",
      "project": "project title or null if general"
    }
  ],
  "healthTrend": "improving or stable or declining",
  "focusRecommendation": "which single project should get attention this week and why, in one sentence"
}

Generate 4-6 insights. Be specific, practical, and developer-focused. Return only the JSON object, nothing else.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code blocks if Gemini adds them anyway
    const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI insights error:", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}