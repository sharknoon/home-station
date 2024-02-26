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
function set_assets(path) {
  assets = initial.assets = path;
}
let read_implementation = null;
let manifest = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
function set_manifest(_) {
  manifest = _;
}
export {
  assets as a,
  base as b,
  set_read_implementation as c,
  set_assets as d,
  read_implementation as e,
  manifest as m,
  override as o,
  reset as r,
  set_manifest as s
};
