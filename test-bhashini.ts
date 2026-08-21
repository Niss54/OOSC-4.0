import { bhashiniTranslate, bhashiniTTS } from "./frontend/src/lib/bhashini";

async function test() {
  try {
    console.log("Testing Bhashini Translate...");
    const translated = await bhashiniTranslate("Hello world, how are you?", "en", "hi");
    console.log("Translated:", translated);

    console.log("Testing Bhashini TTS...");
    const audio = await bhashiniTTS("नमस्ते दुनिया", "hi");
    console.log("TTS audio length (base64):", audio.length);
    
    console.log("All tests passed!");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
