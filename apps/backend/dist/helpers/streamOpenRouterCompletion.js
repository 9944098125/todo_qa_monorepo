"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            ((v = o[n](v)), settle(resolve, reject, v.done, v.value));
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamOpenRouterCompletion = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
dotenv_1.default.config();
const openai = new openai_1.default({
  apiKey: process.env.OPEN_AI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost", // REQUIRED
    "X-Title": "My MERN App", // REQUIRED
  },
});
const streamOpenRouterCompletion = (req, res, options) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const abortController = new AbortController();
    const abortOnDisconnect = () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    };
    res.on("close", abortOnDisconnect);
    try {
      const stream = yield openai.chat.completions.create(
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
      try {
        for (
          var _f = true, stream_1 = __asyncValues(stream), stream_1_1;
          (stream_1_1 = yield stream_1.next()), (_a = stream_1_1.done), !_a;
          _f = true
        ) {
          _c = stream_1_1.value;
          _f = false;
          const chunk = _c;
          if (res.destroyed || res.writableEnded) return;
          const text =
            (_e =
              (_d = chunk.choices[0]) === null || _d === void 0
                ? void 0
                : _d.delta) === null || _e === void 0
              ? void 0
              : _e.content;
          if (typeof text === "string" && text.length > 0) {
            hasContent = true;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_f && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
        } finally {
          if (e_1) throw e_1.error;
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
  });
exports.streamOpenRouterCompletion = streamOpenRouterCompletion;
