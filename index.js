const CONFIG = {
  ollamaUrl: "http://localhost:11434/api/generate",
  model: "llama3",
  prompt: "What is the capital of India?",
  stream: true,
};

async function sendPromptToOllama(prompt, model) {
  const requestBody = {
    model: model,
    prompt: prompt,
    stream: CONFIG.stream,
  };

  console.log(`Model: ${model}`);
  console.log(`Prompt: "${prompt}"`);

  const response = await fetch(CONFIG.ollamaUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (CONFIG.stream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    console.log("\nResponse:");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            process.stdout.write(data.response);
            fullResponse += data.response;
          }
          if (data.done) {
            console.log("\n");
            return fullResponse;
          }
        } catch (e) {}
      }
    }

    return fullResponse;
  } else {
    const data = await response.json();
    if (data.error) {
      throw new Error(`Ollama error: ${data.error}`);
    }
    return data.response;
  }
}

async function main() {
  try {
    const response = await sendPromptToOllama(CONFIG.prompt, CONFIG.model);
    if (!CONFIG.stream) {
      console.log("\nResponse:");
      console.log(response);
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("Make sure Ollama is running: ollama serve");
    } else if (error.message.includes("404")) {
      console.error(`Model not found. Run: ollama pull ${CONFIG.model}`);
    }
    process.exit(1);
  }
}

main();
