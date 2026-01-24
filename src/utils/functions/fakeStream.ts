export async function fakeStream(
  text: string,
  onChunk: (c: string) => void,
  isCancelled: () => boolean,
) {
  for (let i = 0; i < text.length; i++) {
    if (isCancelled()) break;
    await new Promise((r) => setTimeout(r, 50));
    onChunk(text[i]);
  }
}
