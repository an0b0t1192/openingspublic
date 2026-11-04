// ==UserScript==
// @name         Gbv5 opening (0mt) - WebSocket
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  territorial.io - Gbv5 opening, tick offset 0
// @author       elizzi
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
    // cycle 1 base 0ms, cycle 2 base 5600, cycle 3 11200, cycle 4 16800, cycle 5 22400
    // formula: delay = (cycle-1)*5600 + exactTick*560
    const openingSteps = [
        // --- CYCLE 1 ---
        { delay: 3920,  percent: 20.8008 },  // C1 T7.0
        { delay: 5096,  percent: 17.8711 },  // C1 T9.1
        // --- CYCLE 2 ---
        { delay: 9016,  percent: 16.5039 },  // C2 T6.1
        { delay: 9800,  percent: 18.75   },  // C2 T7.5
        { delay: 10192, percent: 39.9414 },  // C2 T8.2
        { delay: 10976, percent: 24.2188 },  // C2 T9.6
        // --- CYCLE 3 ---
        { delay: 14896, percent: 0.0977  },  // C3 T6.6
        { delay: 15288, percent: 22.3633 },  // C3 T7.3
        { delay: 15680, percent: 52.7344 },  // C3 T8.0
        { delay: 16464, percent: 30.1758 },  // C3 T9.4
        // --- CYCLE 4 ---
        { delay: 20384, percent: 0.0977  },  // C4 T6.4
        { delay: 20776, percent: 47.2656 },  // C4 T7.1
        { delay: 21560, percent: 36.1328 },  // C4 T8.5
        { delay: 21952, percent: 88.3789 },  // C4 T9.2
        // --- CYCLE 5 ---
        { delay: 25872, percent: 28.7109 },  // C5 T6.2
        { delay: 26656, percent: 23.9258 },  // C5 T7.6
        { delay: 27048, percent: 31.8359 },  // C5 T8.3
        { delay: 27440, percent: 71.7773 },  // C5 T9.0
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
                        console.log("Match started! Running Gbv5 opening...");
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
