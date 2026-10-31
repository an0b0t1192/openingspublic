// ==UserScript==
// @name         VKJJv9 Websocket
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  w zeta - updated for new game version
// @author       Dr.Web
// @match        https://an0b0t1192.github.io/an0b0ttests/*
// @match        *://territorial.io/*
// @match        *://fxclient.github.io/*
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const g = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    

    const MS_PER_TICK = 56;

    const vkjjSteps = [
        { cycle: 1, exactTick: 7.0, percent: 20.8008 },
        { cycle: 1, exactTick: 9.1, percent: 17.8711 },
        { cycle: 2, exactTick: 6.1, percent: 16.69921875 },
        { cycle: 2, exactTick: 7.5, percent: 18.75 },
        { cycle: 2, exactTick: 8.2, percent: 39.74609375 },
        { cycle: 2, exactTick: 9.6, percent: 24.21875 },
        { cycle: 3, exactTick: 6.6, percent: 0.0977 },
        { cycle: 3, exactTick: 7.3, percent: 22.36328125 },
        { cycle: 3, exactTick: 8.0, percent: 52.5390625 },
        { cycle: 3, exactTick: 9.4, percent: 30.17578125 },
        { cycle: 4, exactTick: 6.4, percent: 0.0977 },
        { cycle: 4, exactTick: 7.1, percent: 47.36328125 },
        { cycle: 4, exactTick: 8.5, percent: 36.1328125 },
        { cycle: 4, exactTick: 9.2, percent: 88.37890625 },
        { cycle: 5, exactTick: 6.2, percent: 28.7109375 },
        { cycle: 5, exactTick: 7.6, percent: 23.92578125 },
        { cycle: 5, exactTick: 8.3, percent: 31.8359375 },
        { cycle: 5, exactTick: 9.1, percent: 71.7773 },
    ];

    const openingSteps = vkjjSteps.map(a => {
        const absoluteTick = (a.cycle - 1) * 100 + Math.round(a.exactTick * 10);
        return {
            delayMs: absoluteTick * MS_PER_TICK,
            percent: a.percent
        };
    }).sort((a, b) => a.delayMs - b.delayMs);

    let timers = [];
    let isRunning = false;
    let wasMatchRunning = false;
    let startTime = 0;

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
            
        } catch (e) {}
    }

    function startSequence() {
        if (isRunning) return;
        isRunning = true;
        timers = [];
        startTime = Date.now();
        

        openingSteps.forEach((step, index) => {
            const extraDelay = (index > 0 && step.delayMs === openingSteps[index - 1].delayMs) ? 5 : 0;
            timers.push(setTimeout(() => {
                if (!isRunning) return;
                sendAttack(step.percent);
            }, step.delayMs + extraDelay));
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
            if (game && typeof game.ct.f3 === 'function') {
                let isMatchRunning = game.ct.f3();
                if (isMatchRunning && !wasMatchRunning) {
                    startSequence();
                } else if (!isMatchRunning && wasMatchRunning) {
                    stopSequence();
                }
                wasMatchRunning = isMatchRunning;
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

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") {
            stopSequence();
        }
    });

})();
