let base = "";
let assets = base;
const initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}
let read_implementation = null;
let manifest = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
function set_manifest(_) {
  manifest = _;
}

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

export { assets as a, base as b, set_read_implementation as c, b64_encode as d, read_implementation as e, b64_decode as f, manifest as m, override as o, reset as r, set_manifest as s };
//# sourceMappingURL=utils-qwb-V3Vy.js.map
