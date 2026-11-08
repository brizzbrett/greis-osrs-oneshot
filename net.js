// Live sessions for the sheet: a thin layer over Firebase Realtime Database.
// The sheet (index.html) works on its own; this file only adds rooms when it loads.
// Data lives under rooms/<code>/: meta (DM, turn order), players/<uid> (sheet summaries),
// log (shared feed), enemies (public enemy info), dm (DM-only: enemy HP/AC, secret rolls),
// buffs/<target uid>/<priest uid> (prayers a priest has put on an ally).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase, ref, set, update, push, get, onValue, onDisconnect, serverTimestamp, query, limitToLast
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// These values identify the project; they're meant to be public. The database rules protect the data.
const firebaseConfig = {
  apiKey: "AIzaSyC348j8dQU2Tt2Ah__Np0dhn0b57I4BU58",
  authDomain: "greis-osrs-oneshot.firebaseapp.com",
  databaseURL: "https://greis-osrs-oneshot-default-rtdb.firebaseio.com",
  projectId: "greis-osrs-oneshot",
  storageBucket: "greis-osrs-oneshot.firebasestorage.app",
  messagingSenderId: "499608118586",
  appId: "1:499608118586:web:cf40fdc18ce1fae08e5c03"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let uid = null;
let code = null;
let unsubs = [];
let lastBuffTargets = new Set();
let presenceSet = false;

const roomRef = p => ref(db, `rooms/${code}${p ? "/" + p : ""}`);

function signIn() {
  return new Promise((resolve, reject) => {
    const off = onAuthStateChanged(auth, user => {
      if (user) { off(); resolve(user.uid); }
    });
    signInAnonymously(auth).catch(err => { off(); reject(err); });
  });
}

const api = {
  get uid() { return uid; },
  get code() { return code; },

  async exists(c) {
    return (await get(ref(db, `rooms/${c}/meta`))).exists();
  },

  async createRoom() {
    for (let i = 0; i < 10; i++) {
      const c = "GREI-" + String(1000 + Math.floor(Math.random() * 9000));
      if (await api.exists(c)) continue;
      await set(ref(db, `rooms/${c}/meta`), { dm: uid, created: serverTimestamp(), round: 1, turn: 0 });
      return c;
    }
    throw new Error("Couldn't find a free room code");
  },

  open(c, h) {
    api.close();
    code = c;
    const fail = e => { if (h.error) h.error(e); };
    const watch = (r, fn) => unsubs.push(onValue(r, s => fn(s.val()), fail));
    watch(roomRef("meta"), v => h.meta(v));
    watch(roomRef("players"), v => h.players(v));
    watch(query(roomRef("log"), limitToLast(80)), v => h.log(v));
    watch(roomRef("enemies"), v => h.enemies(v));
    watch(roomRef(`buffs/${uid}`), v => h.buffs(v));
    if (h.dm) watch(roomRef("dm"), v => h.dm(v));
  },

  close() {
    unsubs.forEach(u => u());
    unsubs = [];
    code = null;
    lastBuffTargets = new Set();
    presenceSet = false;
  },

  publishPlayer(summary) {
    const r = roomRef(`players/${uid}`);
    if (!presenceSet) {
      presenceSet = true;
      onDisconnect(roomRef(`players/${uid}/online`)).set(false).catch(() => { presenceSet = false; });
    }
    return set(r, Object.assign({}, summary, { online: true, ts: serverTimestamp() }));
  },

  removePlayer() { return set(roomRef(`players/${uid}`), null); },

  pushLog(entry) { return push(roomRef("log"), Object.assign({}, entry, { uid, ts: serverTimestamp() })); },
  pushDmLog(entry) { return push(roomRef("dm/log"), Object.assign({}, entry, { uid, ts: serverTimestamp() })); },
  clearLog() { return update(roomRef(), { log: null, "dm/log": null }); },

  setMeta(patch) { return update(roomRef("meta"), patch); },
  // Only the player whose turn it is (or the DM) may pass it on; the rules check turnId
  setTurn(turn, round, turnId) { return update(roomRef("meta"), { turn, round, turnId }); },

  newId() { return push(roomRef("enemies")).key; },
  setEnemy(id, pub, priv) { return update(roomRef(), { [`enemies/${id}`]: pub, [`dm/enemies/${id}`]: priv }); },
  patchEnemy(id, pub, priv) {
    const u = {};
    for (const [k, v] of Object.entries(pub || {})) u[`enemies/${id}/${k}`] = v;
    for (const [k, v] of Object.entries(priv || {})) u[`dm/enemies/${id}/${k}`] = v;
    return update(roomRef(), u);
  },
  removeEnemy(id) { return update(roomRef(), { [`enemies/${id}`]: null, [`dm/enemies/${id}`]: null }); },

  // A priest writes one entry per ally: buffs/<ally>/<priest> = the prayers they're keeping up on that ally
  syncBuffs(map, fromName) {
    const targets = new Set(Object.keys(map));
    const u = {};
    for (const t of targets) u[`buffs/${t}/${uid}`] = { from: uid, fromName, prayers: map[t] };
    for (const t of lastBuffTargets) if (!targets.has(t)) u[`buffs/${t}/${uid}`] = null;
    lastBuffTargets = targets;
    return Object.keys(u).length ? update(roomRef(), u) : Promise.resolve();
  }
};

window.GreisNet = api;
signIn()
  .then(id => { uid = id; if (window.GreisApp) window.GreisApp.attach(api); })
  .catch(err => { if (window.GreisApp) window.GreisApp.failed(err); });
