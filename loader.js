// ==UserScript==
// @name         Opening Loader (with configurable tick offset)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Load openings and shift their timings by tick offset
// @author       Dr.Web (extended)
// @match        https://an0b0t1192.github.io/an0b0ttests/*
// @match        *://territorial.io/*
// @match        *://fxclient.github.io/*
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function(){
    'use strict';

    const g = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    const OPENINGS = {
        1: { name: "GBv4",   url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/gbv4.js" },
        2: { name: "VKJJv9", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/vkjjv9.js" },
        3: { name: "VKJJv7", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/vkjjv7.js" },
        4: { name: "VKJJv8", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/vkjjv8.js" },
        5: { name: "Thigh Ling v2.1 (Singleplayer/ping 0 ms)", url: "https://raw.githubusercontent.com/an0b0t1192/openingspublic/refs/heads/main/tl0.js" }
    };

    const MS_PER_MINITICK = 55.6;
    let TICK_OFFSET_MT = 0;
    const loaded = new Set();

    function menu() {
        console.clear();
        let text = "Opening Script - By Dr.Web\nAvailable openings:";
        for (const [id, o] of Object.entries(OPENINGS)) {
            text += `\n${id}. ${o.name}`;
        }
        const ms = (TICK_OFFSET_MT * MS_PER_MINITICK).toFixed(1);
        text += `\n\nCurrent tick offset: ${TICK_OFFSET_MT} mt (${ms} ms)`;
        text += "\n\n⚠ IMPORTANT: Set the offset FIRST, then load openings!";
        text += "\n   Example: offset(-9)  →  set(1)";
        text += "\n   (Offset only applies to openings loaded AFTER it.)";
        text += "\n\nCommands:";
        text += "\n  offset(number)   - set tick offset (e.g. offset(-9)); run this BEFORE set()";
        text += "\n  offset()         - show current offset";
        text += "\n  set(number)      - load opening (after offset is configured)";
        text += "\n  list()           - show this menu";
        text += "\n  reset()          - clear all loaded openings (reload page to fully reset)";
        console.log(text);
    }

    async function load(id) {
        const o = OPENINGS[id];
        if (!o) return console.log(`> ERROR: Opening #${id} not found.`);
        if (loaded.has(id)) return console.log(`> WARN: ${o.name} is already loaded.`);

        const shiftMs = TICK_OFFSET_MT * MS_PER_MINITICK;
        console.log(`> Loading ${o.name} (offset ${TICK_OFFSET_MT} mt = ${shiftMs.toFixed(1)} ms)...`);

        try {
            const url = o.url + "?t=" + Date.now();
            const code = await (await fetch(url, { cache: "no-store" })).text();

            const origSetTimeout = g.setTimeout;
            const patchedSetTimeout = function(callback, delay, ...args) {
                const adjusted = Math.max(0, (delay || 0) + shiftMs);
                return origSetTimeout(callback, adjusted, ...args);
            };

            g.setTimeout = patchedSetTimeout;
            try {
                new Function('window', 'unsafeWindow', code)(g, g);
            } finally {
                g.setTimeout = origSetTimeout;
            }

            loaded.add(id);
            console.log(`> Loaded ${o.name} with offset ${TICK_OFFSET_MT} mt`);
            if (id === "6" && TICK_OFFSET_MT !== 0) {
                console.log(`> NOTE: "${o.name}" already has -7mt built-in. Your offset ${TICK_OFFSET_MT} mt is applied ON TOP.`);
            }
        } catch (e) {
            console.log(`> ERROR: Failed to load ${o.name}: ${e.message}`);
        }
    }

    g.set    = id => load(Number(id));
    g.list   = menu;
    g.offset = (n) => {
        if (n === undefined) {
            const ms = (TICK_OFFSET_MT * MS_PER_MINITICK).toFixed(1);
            console.log(`> Current tick offset: ${TICK_OFFSET_MT} mt (${ms} ms)`);
            return;
        }
        const v = Number(n);
        if (!Number.isFinite(v)) return console.log("> ERROR: offset expects a number, e.g. offset(-9)");
        TICK_OFFSET_MT = v;
        const ms = (v * MS_PER_MINITICK).toFixed(1);
        console.log(`> Tick offset set to ${v} mt (${ms} ms). Now run set(number). Applies to openings loaded AFTER this point.`);
    };
    g.reset = () => {
        loaded.clear();
        console.log("> Loaded-openings list cleared. Reload page to fully reset already-loaded openings.");
    };

    menu();
})();
