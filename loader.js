(function(){
    const g = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    const OPENINGS = {
        1: { name: "GBv4",   url: "https://raw.githubusercontent.com/USER/REPO/main/gbv4.js" },
        2: { name: "VKJJv9", url: "https://raw.githubusercontent.com/USER/REPO/main/vkjjv9.js" }
    };

    const loaded = new Set();

    const S = {
        hub:   "color:#00ff88;font-weight:bold;font-size:14px;",
        title: "color:#00ffff;font-weight:bold;",
        item:  "color:#ffffff;",
        hint:  "color:#888888;font-style:italic;",
        ok:    "color:#00ff00;font-weight:bold;",
        err:   "color:#ff4444;font-weight:bold;",
        info:  "color:#ffaa00;"
    };

    function log(style, ...args) { console.log(`%c${args.join(" ")}`, style); }

    function menu() {
        console.clear();
        log(S.hub,   "╔══════════════════════════════════════╗");
        log(S.hub,   "║      OPENING SCRIPT — BY DR.WEB      ║");
        log(S.hub,   "╚══════════════════════════════════════╝");
        log(S.title, "Available openings:");
        for (const [id, o] of Object.entries(OPENINGS)) {
            log(S.item, `  ${id}. ${o.name}`);
        }
        log(S.hint,  "Use %cset(opening number)%c to load", "color:#00ff88;font-weight:bold;", S.hint);
        log(S.hint,  "Use %clist()%c to show menu again", "color:#00ff88;font-weight:bold;", S.hint);
    }

    async function load(id) {
        const o = OPENINGS[id];
        if (!o) { log(S.err, `❌ Opening #${id} not found. Use list() to see available.`); return; }
        if (loaded.has(id)) { log(S.info, `⚠️  ${o.name} is already loaded.`); return; }

        log(S.info, `⏳ Loading ${o.name}...`);

        try {
            const code = await (await fetch(o.url, { cache: "no-store" })).text();
            new Function('window', 'unsafeWindow', code)(g, g);
            loaded.add(id);
            log(S.ok, `✅ Setted ${o.name} Opening`);
        } catch (e) {
            log(S.err, `❌ Failed to load ${o.name}: ${e.message}`);
        }
    }

    g.set = id => load(Number(id));
    g.list = menu;

    menu();
    log(S.hint, "(loader is active — type set(1) or set(2) to load an opening)");
})();
