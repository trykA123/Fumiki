export interface AIProviderConfig {
    provider: 'ollama' | 'openai' | 'anthropic';
    baseUrl?: string; // e.g. http://localhost:11434 for Ollama
    apiKey?: string;
    model: string;
}

export interface AIProvider {
    generateSummary(text: string, promptType: 'character' | 'plot' | 'thematic'): Promise<string>;
}

export class OllamaProvider implements AIProvider {
    constructor(private config: AIProviderConfig) { }

    async generateSummary(text: string, promptType: string): Promise<string> {
        const baseUrl = this.config.baseUrl || 'http://localhost:11434';

        let systemPrompt = "You are a helpful literature assistant.";
        if (promptType === 'character') {
            systemPrompt = "Extract and describe all key characters mentioned in the provided text. Return a concise list.";
        } else if (promptType === 'plot') {
            systemPrompt = "Summarize the overarching plot and key events from the provided text.";
        } else if (promptType === 'thematic') {
            systemPrompt = "Identify the main themes and motifs from the provided text, explaining them briefly.";
        }

        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.config.model || 'llama3',
                system: systemPrompt,
                prompt: `Text:\n${text}\n\nTask: ${systemPrompt}`,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response.trim();
    }
}

export class OpenAIProvider implements AIProvider {
    constructor(private config: AIProviderConfig) { }

    async generateSummary(text: string, promptType: string): Promise<string> {
        if (!this.config.apiKey) throw new Error("OpenAI API Key is required");
        const baseUrl = this.config.baseUrl || 'https://api.openai.com/v1';

        let systemPrompt = "You are a helpful literature assistant.";
        if (promptType === 'character') {
            systemPrompt = "Extract and describe all key characters mentioned in the provided text. Return a concise list.";
        } else if (promptType === 'plot') {
            systemPrompt = "Summarize the overarching plot and key events from the provided text.";
        } else if (promptType === 'thematic') {
            systemPrompt = "Identify the main themes and motifs from the provided text, explaining them briefly.";
        }

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model || 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: text }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI Error: ${response.statusText}`);
        }

        const data: any = await response.json();
        return data.choices[0].message.content.trim();
    }
}

export class AnthropicProvider implements AIProvider {
    constructor(private config: AIProviderConfig) { }

    async generateSummary(text: string, promptType: string): Promise<string> {
        if (!this.config.apiKey) throw new Error("Anthropic API Key is required");

        let systemPrompt = "You are a helpful literature assistant.";
        let promptExt = "";
        if (promptType === 'character') {
            promptExt = "Extract and describe all key characters mentioned in the provided text. Return a concise list.";
        } else if (promptType === 'plot') {
            promptExt = "Summarize the overarching plot and key events from the provided text.";
        } else if (promptType === 'thematic') {
            promptExt = "Identify the main themes and motifs from the provided text, explaining them briefly.";
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.model || 'claude-3-haiku-20240307',
                system: systemPrompt,
                messages: [
                    { role: 'user', content: `Text:\n${text}\n\nTask: ${promptExt}` }
                ],
                max_tokens: 1000,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic Error: ${response.statusText}`);
        }

        const data: any = await response.json();
        return data.content[0].text.trim();
    }
}

export function createProvider(config: AIProviderConfig): AIProvider {
    switch (config.provider) {
        case 'ollama': return new OllamaProvider(config);
        case 'openai': return new OpenAIProvider(config);
        case 'anthropic': return new AnthropicProvider(config);
        default: throw new Error(`Unknown provider: ${config.provider}`);
    }
}
