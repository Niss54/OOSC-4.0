import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicantName, schemeName, schemeMinistry, applicationDate, rejectionReason, language = "English" } = body;

    if (!applicantName || !schemeName || !schemeMinistry || !applicationDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: "GROQ API Key is missing" }, { status: 500 });
    }

    const prompt = `Draft a formal RTI application in ${language} to ${schemeMinistry} asking why application for ${schemeName} submitted on ${applicationDate} by ${applicantName} was rejected. 
The given reason for rejection (if any) was: ${rejectionReason || "Not provided"}.
Format the letter professionally: 
To The Public Information Officer, ${schemeMinistry}... 
Subject: RTI Application under RTI Act 2005... 
Ensure the tone is formal and direct. Do not include any markdown formatting like \`\`\` or asterisks, just the plain text of the letter.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // Using a fast, reliable model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json({ error: "Failed to generate RTI draft" }, { status: 500 });
    }

    const data = await response.json();
    const draft = data.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Grievance API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
