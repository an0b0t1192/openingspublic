// ==UserScript==
// @name         GBv4 WebSocket Script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  GBv4 (WebSocket) by Dr.Web - updated for new game version
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
    

    // --- Timings (ms) ---
    const openingSteps = [
        { delay: 3853, percent: 20.840950 },
        { delay: 5018, percent: 17.733089 },
        { delay: 9704, percent: 0.080450523 },
        { delay: 10124, percent: 37.56694721 },
        { delay: 14850, percent: 15.42917325 },
        { delay: 15650, percent: 41.50308469 },
        { delay: 19575, percent: 29.56930872 },
        { delay: 20825, percent: 51.25932836 },
        { delay: 21675, percent: 45.96848934 },
        { delay: 22073, percent: 92.8807947 },
        { delay: 25835, percent: 28.90258216 },
        { delay: 26805, percent: 24.21471173 },
        { delay: 27025, percent: 32.22222222 },
        { delay: 27425, percent: 73.47232207 },
    ];

    let timers = [];
    let isRunning = false;
    let wasMatchRunning = false;

    // Хелпер: получить нужные модули
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

        // Проверка: матч идёт, я живой
        if (ct.dX !== 1) return;
        if (!d3.eF[ct.eG]) return;

        const attackValue = Math.floor((percent / 100) * 1024);
        try {
            // В новой версии: gD.n1.oY(percentValue, targetPlayerId)
            // target = ct.cv означает "нейтральная земля" (аналог старого c.c2)
            if (ct.kD) {
                // single player / боты — используем aKd? В новой версии aKd = oV (оффлайн-атаки)
                // Для онлайн-игры используется gD.n1
            }
            gD.n1.oY(attackValue, ct.cv);
            
        } catch (e) {
            
        }
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

    // Match Monitor
    function monitorGameState() {
        try {
            const game = getGame();
            if (game) {
                const { ct } = game;
                if (typeof ct.f3 === 'function') {
                    let isMatchRunning = ct.f3();

                    if (isMatchRunning && !wasMatchRunning) {
                        console.log("Match started! Running opening...");
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

    // Wait game load
    function waitForGame() {
        const game = getGame();
        if (game && typeof game.ct.f3 === 'function') {
            monitorGameState();
            
        } else {
            setTimeout(waitForGame, 100);
        }
    }

    waitForGame();

    // Stop with P button
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") stopSequence();
    });

})();
