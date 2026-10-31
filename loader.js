(function(){
    const g = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    const OPENINGS = {
        1: { name: "GBv4",   url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/gbv4.js" },
        2: { name: "VKJJv9", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/vkjjv9.js" }
    };

    const loaded = new Set();

    function menu() {
        console.clear();
        // Убрал %c, чтобы на мобилках не было сырого CSS
        console.log("========================================");
        console.log("      OPENING SCRIPT - BY DR.WEB        ");
        console.log("========================================");
        console.log("Available openings:");
        for (const [id, o] of Object.entries(OPENINGS)) {
            console.log(`  ${id}. ${o.name}`);
        }
        console.log("\nUse set(opening number) to load");
        console.log("Use list() to show menu again\n");
    }

    async function load(id) {
        const o = OPENINGS[id];
        if (!o) {
            console.log(`[ERROR] Opening #${id} not found.`);
            return;
        }
        if (loaded.has(id)) {
            console.log(`[WARN] ${o.name} is already loaded.`);
            return;
        }

        console.log(`[INFO] Loading ${o.name}...`);

        try {
            const code = await (await fetch(o.url, { cache: "no-store" })).text();
            
            // Выполняем код
            new Function('window', 'unsafeWindow', code)(g, g);
            
            loaded.add(id);
            console.log(`[SUCCESS] Setted ${o.name} Opening`);
        } catch (e) {
            console.log(`[ERROR] Failed to load ${o.name}: ${e.message}`);
        }
    }

    // Глобальные команды
    g.set = id => load(Number(id));
    g.list = menu;

    // Показываем меню при запуске
    menu();
    console.log("(loader is active)");
})();
