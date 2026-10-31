// ==UserScript==
// @name         thigh ling opening (-7mt) - WebSocket
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  territorial.io - thigh ling opening, -7 miniticks early (-389ms)
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

    // Timings (ms), -7 miniticks = -389.2 ms from exact tick
    const EARLY_OFFSET = 389;

    const openingSteps = [
        // --- CYCLE 1 ---
        { delay: 3892 - EARLY_OFFSET, percent: 20.8008 },  // Z  C1 T7.0
        { delay: 5060 - EARLY_OFFSET, percent: 17.8711 },  // D  C1 T9.1
        // --- CYCLE 2 ---
        { delay: 8952 - EARLY_OFFSET, percent: 16.5039 },  // E  C2 T6.1
        { delay: 9730 - EARLY_OFFSET, percent: 18.75   },  // F  C2 T7.5
        { delay: 10119 - EARLY_OFFSET, percent: 39.9414 }, // R  C2 T8.2
        { delay: 10898 - EARLY_OFFSET, percent: 24.2188 }, // G  C2 T9.6
        // --- CYCLE 3 ---
        { delay: 14790 - EARLY_OFFSET, percent: 0.0977  }, // T  C3 T6.6
        { delay: 15179 - EARLY_OFFSET, percent: 22.3633 }, // H  C3 T7.3
        { delay: 15568 - EARLY_OFFSET, percent: 52.7344 }, // Y  C3 T8.0
        { delay: 16346 - EARLY_OFFSET, percent: 30.1758 }, // J  C3 T9.4
        // --- CYCLE 4 ---
        { delay: 20238 - EARLY_OFFSET, percent: 0.0977  }, // U  C4 T6.4
        { delay: 20628 - EARLY_OFFSET, percent: 47.2656 }, // K  C4 T7.1
        { delay: 21406 - EARLY_OFFSET, percent: 36.1328 }, // I  C4 T8.5
        { delay: 21795 - EARLY_OFFSET, percent: 88.3789 }, // L  C4 T9.2
        // --- CYCLE 5 ---
        { delay: 25687 - EARLY_OFFSET, percent: 28.7109 }, // O  C5 T6.2
        { delay: 26466 - EARLY_OFFSET, percent: 23.9258 }, // M  C5 T7.6
        { delay: 26855 - EARLY_OFFSET, percent: 31.8359 }, // P  C5 T8.3
        { delay: 27300 - EARLY_OFFSET, percent: 71.7773 }, // ù  C5 T9.1
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

        if (ct.dX !== 1) return;
        if (!d3.eF[ct.eG]) return;

        const attackValue = Math.floor((percent / 100) * 1024);
        try {
            gD.n1.oY(attackValue, ct.cv);
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
                        console.log("Match started! Running thigh ling opening (-7mt)...");
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
