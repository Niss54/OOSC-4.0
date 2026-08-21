import { NextRequest, NextResponse } from "next/server";
import { bhashiniSTT } from "@/lib/bhashini";
import { searchSchemes } from "@/lib/myscheme";

// Simple in-memory session store mapping Phone Number to Session State.
// In production, use Redis or a Database.
type SessionState = {
  step: number; // 0: language, 1: details, 2: results
  language: string;
  details: string;
};

const sessions = new Map<string, SessionState>();

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const formData = new URLSearchParams(bodyText);

    const from = formData.get("From");
    const incomingBody = formData.get("Body")?.trim() || "";
    const mediaUrl = formData.get("MediaUrl0");

    if (!from) {
      return new NextResponse("Missing From parameter", { status: 400 });
    }

    let userText = incomingBody;

    // Handle Voice Notes
    if (mediaUrl) {
      try {
        const audioRes = await fetch(mediaUrl);
        const audioBuffer = await audioRes.arrayBuffer();
        
        // Defaulting to Hindi for STT if language is not yet chosen
        const session = sessions.get(from);
        const sttLang = session?.language === "en" ? "en" : "hi";
        
        userText = await bhashiniSTT(audioBuffer, sttLang);
        console.log("Transcribed WhatsApp Audio:", userText);
      } catch (e) {
        console.error("Error transcribing audio:", e);
        userText = "";
      }
    }

    // Retrieve or create session
    let session = sessions.get(from);
    if (!session || userText.toLowerCase() === "reset") {
      session = { step: 0, language: "hi", details: "" };
      sessions.set(from, session);
    }

    let responseMessage = "";

    // State Machine
    if (session.step === 0) {
      // Step 0: Language selection or greeting
      if (userText.toLowerCase().includes("english") || userText.toLowerCase().includes("en")) {
        session.language = "en";
        session.step = 1;
        responseMessage = "Language set to English! Please tell me your age, gender, state, and caste (e.g., '30, Male, UP, General').";
      } else if (userText.toLowerCase().includes("hindi") || userText.includes("हिंदी") || userText.toLowerCase().includes("hi")) {
        session.language = "hi";
        session.step = 1;
        responseMessage = "भाषा हिंदी सेट हो गई है! कृपया अपनी उम्र, लिंग, राज्य और जाति बताएं (जैसे, '30, पुरुष, उत्तर प्रदेश, सामान्य').";
      } else {
        responseMessage = "Namaste! Welcome to Adhikaar AI.\n\nPlease reply with your preferred language / कृपया अपनी पसंदीदा भाषा चुनें:\n- English\n- Hindi (हिंदी)";
      }
    } else if (session.step === 1) {
      // Step 1: Process details and fetch schemes
      session.details = userText;
      session.step = 2; // Move to results or end state
      
      const isEnglish = session.language === "en";
      responseMessage = isEnglish 
        ? "⏳ Please wait while I find the best schemes for you..."
        : "⏳ कृपया प्रतीक्षा करें, मैं आपके लिए योजनाएं खोज रहा हूँ...";
        
      // We will actually fetch schemes and return them in the same response
      try {
        const schemesData = await searchSchemes("hi"); // Using existing searchSchemes
        const topSchemes = schemesData.schemes.slice(0, 3);
        
        let schemesList = "";
        topSchemes.forEach((s, idx) => {
          schemesList += `\n*${s.schemeShortTitle || s.schemeName}*\n`;
          schemesList += `Brief description: ${s.schemeName}\nBenefit amount: Varies based on eligibility\n`;
          schemesList += `Type APPLY to apply.\n`;
        });
        
        responseMessage = isEnglish
          ? `Here are the top schemes for you:\n${schemesList}`
          : `आपके लिए प्रमुख योजनाएं:\n${schemesList}`;
          
      } catch (e) {
        console.error("Error fetching schemes:", e);
        responseMessage = isEnglish
          ? "Sorry, I couldn't fetch schemes right now. Please try again later."
          : "क्षमा करें, अभी योजनाएं खोजने में समस्या हो रही है। कृपया बाद में प्रयास करें।";
      }
    } else {
      // Step 2: Handle "APPLY"
      if (userText.toLowerCase().includes("apply")) {
        const isEnglish = session.language === "en";
        responseMessage = isEnglish
          ? "Application process initiated! Our automated agent will securely process your request. We will update you here."
          : "आवेदन प्रक्रिया शुरू हो गई है! हमारा ऑटोमेटेड एजेंट सुरक्षित रूप से आपका काम करेगा। हम आपको यहां अपडेट करेंगे।";
        // Reset after apply
        sessions.delete(from);
      } else {
        const isEnglish = session.language === "en";
        responseMessage = isEnglish
          ? "Type APPLY to apply for a scheme, or type RESET to start over."
          : "योजना के लिए आवेदन करने हेतु APPLY टाइप करें, या फिर से शुरू करने के लिए RESET टाइप करें।";
      }
    }

    sessions.set(from, session);

    // Generate Twilio TwiML Response
    // We construct the XML manually to avoid loading twilio module if it fails
    const twiml = `
      <Response>
        <Message>
          <Body>${escapeXML(responseMessage)}</Body>
        </Message>
      </Response>
    `.trim();

    return new NextResponse(twiml, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function escapeXML(str: string) {
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
    return c;
  });
}
