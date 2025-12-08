import type { GeminiContent, GeminiRequest } from '@/types/types';

const APP_ID = import.meta.env.VITE_APP_ID;
const API_URL = 'https://api-integrations.appmedo.com/app-83hdwq5lhuyp/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';

export class GeminiService {
  async streamChat(
    contents: GeminiContent[],
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID,
        },
        body: JSON.stringify({ contents } as GeminiRequest),
        signal,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                onChunk(text);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        onError(error.message);
      } else {
        onError('An unknown error occurred');
      }
    }
  }

  convertToGeminiFormat(
    messages: Array<{ role: 'user' | 'assistant'; content: string; imageData?: string | null }>
  ): GeminiContent[] {
    return messages.map((msg) => {
      const parts: GeminiContent['parts'] = [];

      if (msg.imageData) {
        const [mimeType, base64Data] = msg.imageData.split(',');
        const cleanMimeType = mimeType.replace('data:', '').replace(';base64', '');
        parts.push({
          inlineData: {
            mimeType: cleanMimeType,
            data: base64Data,
          },
        });
      }

      parts.push({ text: msg.content });

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });
  }
}

export const geminiService = new GeminiService();
