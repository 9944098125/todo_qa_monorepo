import { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

type StreamMessage = {
  role: "system" | "user";
  content: string;
};

type StreamOptions = {
  messages: StreamMessage[];
  maxTokens: number;
  temperature: number;
};

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost", // REQUIRED
    "X-Title": "My MERN App", // REQUIRED
  },
});

export const streamOpenRouterCompletion = async (
  req: Request,
  res: Response,
  options: StreamOptions,
): Promise<void> => {
  const abortController = new AbortController();

  const abortOnDisconnect = () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  };

  res.on("close", abortOnDisconnect);

  try {
    const stream = await openai.chat.completions.create(
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: options.messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        stream: true,
      },
      { signal: abortController.signal },
    );

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    let hasContent = false;

    for await (const chunk of stream) {
      if (res.destroyed || res.writableEnded) return;

      const text = chunk.choices[0]?.delta?.content;

      if (typeof text === "string" && text.length > 0) {
        hasContent = true;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    if (res.destroyed || res.writableEnded) return;

    if (!hasContent) {
      res.write(
        `data: ${JSON.stringify({
          error: "AI failed to generate a response.",
        })}\n\n`,
      );
      res.end();
      return;
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    if (abortController.signal.aborted || res.destroyed) return;

    if (res.headersSent) {
      if (!res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({
            error: "AI streaming failed. Please try again.",
          })}\n\n`,
        );
        res.end();
      }
      return;
    }

    throw error;
  } finally {
    res.off("close", abortOnDisconnect);
  }
};
