- [ ] Fix install failure for native dependency `better-sqlite3`
- [ ] Decide between (A) downgrading Node to a version with prebuilt binaries, or (B) forcing C++20 toolchain for node-gyp
- [ ] Implement chosen fix:
  - [x] Option A: downgrade/pin Node to a version with `better-sqlite3` prebuilt binaries (avoid source build)
  - [ ] Add Node version pin to repo (either `.nvmrc` or `engines.node`) and document required Node version
- [ ] Clean install
  - [ ] Remove `node_modules` + `package-lock.json`
  - [ ] Reinstall with pinned Node
- [ ] Run `npm run dev` (or `npm install`) and confirm no native build errors


