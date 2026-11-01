(function(){
    // Ищем unsafeWindow (для Tampermonkey), иначе берем обычный window
    const g = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    
    const OPENINGS = {
        1: { name: "GBv4",   url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/gbv4.js" },
        2: { name: "VKJJv9", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/vkjjv9.js" },
        3: { name: "VKJJv7", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/vkjjv7.js" },
        4: { name: "Thigh Ling v2.1 (Singleplayer/ping 0 ms)", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/tl0.js" },
        5: { name: "Thigh Ling v2.1 (Multiplayer/ping 389ms)", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/tl7.js" }
    };
    
    const loaded = new Set();

    function menu() {
        console.clear();
        let text = "Opening Script - By Dr.Web\nAvailable openings:";
        for (const [id, o] of Object.entries(OPENINGS)) {
            text += `\n${id}. ${o.name}`;
        }
        text += "\nUse set(number) to load";
        console.log(text);
    }

    async function load(id) {
        const o = OPENINGS[id];
        if (!o) return console.log(`> ERROR: Opening #${id} not found.`);
        if (loaded.has(id)) return console.log(`> WARN: ${o.name} is already loaded.`);

        console.log(`> Loading ${o.name}...`);
        try {
            const url = o.url + "?t=" + Date.now();
            const code = await (await fetch(url, { cache: "no-store" })).text();
            
            // Передаем g (unsafeWindow) внутрь скрипта, чтобы он видел ct, d3 и gD
            new Function('window', 'unsafeWindow', code)(g, g);
            
            loaded.add(id);
            console.log(`> Setted ${o.name} Opening`);
        } catch (e) {
            console.log(`> ERROR: Failed to load ${o.name}: ${e.message}`);
        }
    }

    // Привязываем команды
    g.set = id => { load(Number(id)); };
    g.list = menu;
    
    // Показываем меню
    menu();
})();
