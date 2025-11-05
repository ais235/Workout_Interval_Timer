import { useCallback } from 'react';

const langMap: { [key: string]: string } = {
    en: 'en-US',
    es: 'es-ES',
    ru: 'ru-RU',
};

export const useSpeech = () => {
  const speak = useCallback((text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langMap[lang] || 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.cancel(); // Cancel any previous speech
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis failed:", error);
      }
    } else {
      console.error("Speech Synthesis API is not supported in this browser.");
    }
  }, []);

  return { speak };
};
