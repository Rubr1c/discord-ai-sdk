const DISCORD_MESSAGE_LIMIT = 2000;

export function splitMessage(message: string): string[] {
  if (message.length <= DISCORD_MESSAGE_LIMIT) {
    return [message];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  const lines = message.split('\n');

  for (const line of lines) {
    if (line.length > DISCORD_MESSAGE_LIMIT) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      const words = line.split(' ');
      for (const word of words) {
        if ((currentChunk + word + ' ').length > DISCORD_MESSAGE_LIMIT) {
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = word + ' ';
        } else {
          currentChunk += word + ' ';
        }
      }
    } else {
      if ((currentChunk + line + '\n').length > DISCORD_MESSAGE_LIMIT) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = line + '\n';
      } else {
        currentChunk += line + '\n';
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [message];
}
