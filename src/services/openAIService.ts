import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;
let speechSynthesis: SpeechSynthesis | null = null;

try {
  if (apiKey && apiKey !== 'your_openai_api_key_here') {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  
  if (typeof window !== 'undefined') {
    speechSynthesis = window.speechSynthesis;
  }
} catch (error) {
  console.error('Failed to initialize speech services:', error);
}

export async function generateSpeech(text: string): Promise<void> {
  if (!text.trim()) return;

  try {
    if (openai) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
        speed: 1.1,
      });

      const blob = await mp3.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = reject;
        audio.play();
      });
    } else if (speechSynthesis) {
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1;
        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);
        speechSynthesis.speak(utterance);
      });
    } else {
      throw new Error('No speech synthesis service available');
    }
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}