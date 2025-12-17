
import { GenerateStreamParams } from "../types";
import { apiFetch } from "./api";

// --- Audio Decoding Helpers for Gemini TTS ---

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// ---------------------------------------------

export const generateSpeech = async (text: string): Promise<Uint8Array | null> => {
  // Truncate to avoid payload limits (4500 chars is a safe limit for stability)
  const safeText = text.slice(0, 4500);

  try {
    const data = await apiFetch<{ audioData: string }>('/gemini/speech', {
      method: 'POST',
      body: JSON.stringify({ text: safeText })
    });

    if (!data || !data.audioData) return null;
    return decodeBase64(data.audioData);

  } catch (error) {
    console.error("Speech generation error:", error);
    return null;
  }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string, languageCode: string = 'en-US'): Promise<string> => {
  try {
    // Sanitize MIME type (remove codecs, e.g. "audio/webm;codecs=opus" -> "audio/webm")
    const safeMimeType = mimeType.split(';')[0];

    const data = await apiFetch<{ text: string }>('/gemini/transcribe', {
      method: 'POST',
      body: JSON.stringify({ audioBase64, mimeType: safeMimeType, languageCode })
    });
    return data && data.text ? data.text : "";
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

export const lookupMedicalTerm = async (term: string, region: string = 'International', language: string = 'en-US'): Promise<string> => {
  try {
    const data = await apiFetch<{ text: string }>('/gemini/lookup', {
      method: 'POST',
      body: JSON.stringify({ term, region, language })
    });
    return data && data.text ? data.text : "Definition not found.";
  } catch (error) {
    console.error("Dictionary lookup error:", error);
    throw new Error("Failed to retrieve definition.");
  }
};

export const streamChatResponse = async ({
  history,
  newMessage,
  region,
  country,
  userRole,
  isShortAnswer,
  language = 'English',
  onChunk,
  signal,
  sessionId,
}: GenerateStreamParams): Promise<string> => {

  try {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token && token !== 'null' && token !== 'undefined') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const data = await apiFetch<{ text: string }>('/chat/message', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: newMessage,
        history,
        region,
        country,
        userRole,
        language,
        isShortAnswer,
        sessionId
      }),
      signal
    });

    if (!data || !data.text) {
      throw new Error('Invalid response format');
    }

    const fullText = data.text;
    onChunk(fullText);
    return fullText;

  } catch (error: any) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error("DEBUG: Backend Chat API Error Details:", {
      message: error.message,
      stack: error.stack,
      url: '/chat/message'
    });
    throw error;
  }
};

export const generateRelatedQuestions = async (
  lastMessage: string,
  lastResponse: string,
  userRole: string,
  language: string = 'English'
): Promise<string[]> => {
  try {
    const data = await apiFetch<string[]>('/gemini/related', {
      method: 'POST',
      body: JSON.stringify({ lastMessage, lastResponse, userRole, language })
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to generate related questions:", error);
    return [];
  }
};
