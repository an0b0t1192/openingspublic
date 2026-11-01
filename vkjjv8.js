// ==UserScript==
// @name         Vkij V8 / GB V5 opening (0mt) - WebSocket
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  territorial.io - Vkij V8 / GB V5 opening, tick offset 0
// @author       Kerosene (ported to WebSocket)
// @match        https://an0b0t1192.github.io/an0b0ttests/*
// @match        *://territorial.io/*
// @match        *://fxclient.github.io/*
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const g = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    // Timings (ms), tick offset 0 (exact tick)
    // cycle 1 base 0ms, cycle 2 base 5560, cycle 3 11120, cycle 4 16680, cycle 5 22240
    const openingSteps = [
        // --- CYCLE 1 --- (144L, 799T)
        { delay: 3892,  percent: 20.8008 },  // Z  C1 T7.0
        { delay: 5060,  percent: 17.8711 },  // D  C1 T9.1
        // --- CYCLE 2 --- (544L, 1043T)
        { delay: 8952,  percent: 16.5039 },  // E  C2 T6.1
        { delay: 9730,  percent: 18.75   },  // F  C2 T7.5
        { delay: 10119, percent: 39.9414 },  // R  C2 T8.2
        { delay: 10898, percent: 24.2188 },  // G  C2 T9.6
        // --- CYCLE 3 --- (1104L, 1650T)
        { delay: 14790, percent: 0.0977  },  // T  C3 T6.6
        { delay: 15179, percent: 22.3633 },  // H  C3 T7.3
        { delay: 15568, percent: 52.7344 },  // Y  C3 T8.0
        { delay: 16346, percent: 30.1758 },  // J  C3 T9.4
        // --- CYCLE 4 --- (2244L, 2474T)
        { delay: 20238, percent: 0.0977  },  // U  C4 T6.4
        { delay: 20628, percent: 47.2656 },  // K  C4 T7.1
        { delay: 21406, percent: 36.1328 },  // I  C4 T8.5
        { delay: 21795, percent: 88.3789 },  // L  C4 T9.2
        // --- CYCLE 5 --- (3784L, 4361T)
        { delay: 25687, percent: 28.7109 },  // O  C5 T6.2
        { delay: 26466, percent: 23.9258 },  // M  C5 T7.6
        { delay: 26855, percent: 31.8359 },  // P  C5 T8.3
        { delay: 27300, percent: 71.7773 },  // ù  C5 T9.1
    ];

    let timers = [];
    let isRunning = false;
    let wasMatchRunning = false;

    function getGame() {
        const ct = g.ct;
        const d3 = g.d3;
        const gD = g.gD;
        if (!ct || !d3 || !gD) return null;
        return { ct, d3, gD };
    }

    function sendAttack(percent) {
        const game = getGame();
        if (!game) return;
        const { ct, d3, gD } = game;

        if (ct.dX !== 1) return;          // match running
        if (!d3.eF[ct.eG]) return;        // player alive

        const attackValue = Math.floor((percent / 100) * 1024);
        try {
            gD.n1.oY(attackValue, ct.cv); // ct.cv = neutral land
        } catch (e) { /* ignore */ }
    }

    function startSequence() {
        if (isRunning) return;
        isRunning = true;
        timers = [];

        openingSteps.forEach(step => {
            timers.push(setTimeout(() => {
                if (!isRunning) return;
                sendAttack(step.percent);
            }, step.delay));
        });
    }

    function stopSequence() {
        if (!isRunning) return;
        timers.forEach(clearTimeout);
        timers = [];
        isRunning = false;
    }

    function monitorGameState() {
        try {
            const game = getGame();
            if (game) {
                const { ct } = game;
                if (typeof ct.f3 === 'function') {
                    const isMatchRunning = ct.f3();
                    if (isMatchRunning && !wasMatchRunning) {
                        console.log("Match started! Running Vkij V8 / GB V5 opening (0mt)...");
                        startSequence();
                    } else if (!isMatchRunning && wasMatchRunning) {
                        stopSequence();
                    }
                    wasMatchRunning = isMatchRunning;
                }
            }
        } catch (e) {}
        requestAnimationFrame(monitorGameState);
    }

    function waitForGame() {
        const game = getGame();
        if (game && typeof game.ct.f3 === 'function') {
            monitorGameState();
        } else {
            setTimeout(waitForGame, 100);
        }
    }

    waitForGame();

    // P — stop
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") stopSequence();
    });

})();
