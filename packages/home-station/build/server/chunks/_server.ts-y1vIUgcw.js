import path from 'node:path';
import { a as getAppDataPath } from './appdata-osNviCV5.js';
import { e as read_implementation, f as b64_decode, b as base, m as manifest } from './utils-qwb-V3Vy.js';
import 'node:fs/promises';
import 'node:os';
import 'winston';

function read(asset) {
  if (!read_implementation) {
    throw new Error(
      "No `read` implementation was provided. Please ensure that your adapter is up to date and supports this feature"
    );
  }
  if (asset.startsWith("data:")) {
    const [prelude, data] = asset.split(";");
    const type = prelude.slice(5) || "application/octet-stream";
    if (data.startsWith("base64,")) {
      const decoded2 = b64_decode(data.slice(7));
      return new Response(decoded2, {
        headers: {
          "Content-Length": decoded2.byteLength.toString(),
          "Content-Type": type
        }
      });
    }
    const decoded = decodeURIComponent(data);
    return new Response(decoded, {
      headers: {
        "Content-Length": decoded.length.toString(),
        "Content-Type": type
      }
    });
  }
  const file = asset.slice(base.length + 1);
  if (file in manifest._.server_assets) {
    const length = manifest._.server_assets[file];
    const type = manifest.mimeTypes[file.slice(file.lastIndexOf("."))];
    return new Response(read_implementation(file), {
      headers: {
        "Content-Length": "" + length,
        "Content-Type": type
      }
    });
  }
  throw new Error(`Asset does not exist: ${file}`);
}
const GET = async ({ params }) => {
  return read(path.join(await getAppDataPath(), params.path));
};

export { GET };
//# sourceMappingURL=_server.ts-y1vIUgcw.js.map
