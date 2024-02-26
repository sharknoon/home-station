function b64_decode(text) {
  const d = atob(text);
  const u8 = new Uint8Array(d.length);
  for (let i = 0; i < d.length; i++) {
    u8[i] = d.charCodeAt(i);
  }
  return u8.buffer;
}
function b64_encode(buffer) {
  if (globalThis.Buffer) {
    return Buffer.from(buffer).toString("base64");
  }
  const little_endian = new Uint8Array(new Uint16Array([1]).buffer)[0] > 0;
  return btoa(
    new TextDecoder(little_endian ? "utf-16le" : "utf-16be").decode(
      new Uint16Array(new Uint8Array(buffer))
    )
  );
}
export {
  b64_decode as a,
  b64_encode as b
};
