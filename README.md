# Local LLM Prompt Runner

Node.js script that connects to Ollama and sends prompts to local LLMs.

## Requirements

- Node.js 18+
- Ollama installed and running

## Setup

1. Install Ollama from https://ollama.com
2. Start Ollama: `ollama serve`
3. Pull a model: `ollama pull llama3`

## Usage

```bash
npm start
```

## Configuration

Edit the CONFIG object in `index.js`:

```javascript
const CONFIG = {
  model: "llama3", // Change model
  prompt: "Your prompt", // Change prompt
  stream: true, // true = real-time, false = complete response
};
```

## Available Models

Currently configured: **llama3**

To use other models:

1. Pull the model: `ollama pull mistral`
2. Change model in CONFIG: `model: "mistral"`

Other models: mistral, phi, tinyllama
