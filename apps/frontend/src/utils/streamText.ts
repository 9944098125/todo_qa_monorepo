type StreamTextOptions = {
  url: string;
  body: Record<string, string>;
  onText: (fullText: string) => void;
  signal?: AbortSignal;
  delayMs?: number;
};

export const streamText = ({
  url,
  body,
  onText,
  signal,
  delayMs = 40,
}: StreamTextOptions): Promise<string> => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    credentials: 'include',
    body: JSON.stringify(body),
    signal,
  }).then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || `Request failed: ${response.status}`);
      });
    }

    if (!response.body) {
      throw new Error('The server does not support streaming responses.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let fullText = '';
    let displayedText = '';
    let queue = '';
    let finished = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    return new Promise<string>((resolve, reject) => {
      const processEvent = (event: string) => {
        const data = event
          .split(/\r?\n/)
          .filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).trimStart())
          .join('\n');

        if (!data) return;

        if (data === '[DONE]') {
          finished = true;
          return;
        }

        const parsed = JSON.parse(data);

        if (parsed.error) {
          throw new Error(parsed.error);
        }

        if (typeof parsed.text === 'string') {
          fullText += parsed.text;
          queue += parsed.text;
          showNextCharacter();
        }
      };

      const showNextCharacter = () => {
        if (timer || queue.length === 0) {
          if (finished && queue.length === 0) {
            resolve(fullText);
          }
          return;
        }

        timer = setTimeout(() => {
          timer = undefined;

          if (signal?.aborted) {
            reader.cancel().catch(() => undefined);
            reject(new Error('AbortError'));
            return;
          }

          displayedText += queue[0];
          queue = queue.slice(1);

          onText(displayedText);

          if (queue.length > 0) {
            showNextCharacter();
          } else if (finished) {
            resolve(fullText);
          }

          readNext();
        }, delayMs);
      };

      const readNext = () => {
        if (finished || signal?.aborted) {
          if (signal?.aborted) {
            reject(new Error('AbortError'));
          }
          return;
        }

        reader
          .read()
          .then(({ value, done }) => {
            if (done) {
              buffer += decoder.decode();

              if (buffer.trim()) processEvent(buffer);

              if (queue.length === 0 && !timer) {
                resolve(fullText);
              }
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split(/\r?\n\r?\n/);
            buffer = events.pop() ?? '';

            try {
              events.forEach(processEvent);
            } catch (error) {
              if (timer) clearTimeout(timer);
              reader.cancel().catch(() => undefined);
              reject(error);
              return;
            }

            readNext();
          })
          .catch(reject);
      };

      readNext();
    });
  });
};
