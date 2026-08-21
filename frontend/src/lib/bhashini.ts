export const BHASHINI_USER_ID = process.env.BHASHINI_USER_ID || "28b2f8853c-3826-4256-9b24-0e1a733feee7";
export const BHASHINI_API_KEY = process.env.BHASHINI_API_KEY || "nJhuL08q3SCLUCPKF_S37jMtKcA2SfSLZ8XmYJcJ1xxyyDIUHiER87T06vnXTA8V";
const BHASHINI_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

export async function bhashiniSTT(audioBuffer: ArrayBuffer, languageCode: string): Promise<string> {
  const bytes = new Uint8Array(audioBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const audioBase64 = btoa(binary);

  const response = await fetch(BHASHINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": BHASHINI_API_KEY,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "asr",
          config: {
            language: {
              sourceLanguage: languageCode
            }
          }
        }
      ],
      inputData: {
        audio: [
          {
            audioContent: audioBase64
          }
        ]
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Bhashini STT error: ${response.status}`);
  }

  const data = await response.json();
  return data.pipelineResponse?.[0]?.output?.[0]?.source || "";
}

export async function bhashiniTTS(text: string, languageCode: string): Promise<string> {
  const response = await fetch(BHASHINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": BHASHINI_API_KEY,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "tts",
          config: {
            language: {
              sourceLanguage: languageCode
            }
          }
        }
      ],
      inputData: {
        input: [
          {
            source: text
          }
        ]
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Bhashini TTS error: ${response.status}`);
  }

  const data = await response.json();
  return data.pipelineResponse?.[0]?.audio?.[0]?.audioContent || "";
}

export async function bhashiniTranslate(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const response = await fetch(BHASHINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": BHASHINI_API_KEY,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: {
              sourceLanguage: sourceLang,
              targetLanguage: targetLang
            }
          }
        }
      ],
      inputData: {
        input: [
          {
            source: text
          }
        ]
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Bhashini Translate error: ${response.status}`);
  }

  const data = await response.json();
  return data.pipelineResponse?.[0]?.output?.[0]?.target || text;
}
