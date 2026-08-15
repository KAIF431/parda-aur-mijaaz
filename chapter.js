document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. RESTORE USER PREFERENCES (THEME, FONT, SIZE)
    // ==========================================
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedFont = localStorage.getItem('selectedFont');
    const savedSize = localStorage.getItem('selectedSize');

    if (savedTheme) applyTheme(savedTheme);
    if (savedFont) applyFont(savedFont);
    if (savedSize) applySize(savedSize);

    // Dynamic Home logo link resolver (Works both in  subfolder & at root)
    const logoLink = document.querySelector("a.logo");
    if (logoLink) {
        if (window.location.pathname.indexOf("/") !== -1) {
            logoLink.setAttribute("href", "home.html");
        } else {
            logoLink.setAttribute("href", "home.html");
        }
    }

    // ==========================================
    // 1. CHARACTER DATA & AUTO-HIGHLIGHTER SYSTEM
    // ==========================================
    const characterData = {
        fahad: { name: "Fahad", desc: "Main Protagonist. Quiet, hardworking, and deeply spiritual." },
        aamina: { name: "Aamina", desc: "A thoughtful girl whose name unexpectedly becomes part of Fahad's prayer." }
    };

    function autoHighlightCharacters() {
        const storyBody = document.querySelectorAll('.story-body, .part-content');
        if (!storyBody.length) return;

        storyBody.forEach(body => {
            const paragraphs = body.querySelectorAll('p');
            paragraphs.forEach(p => {
                if (p.getAttribute('data-highlighted') === 'true') return;

                let html = p.innerHTML;

                // Safely match outside HTML tags using regex
                html = html.replace(/\bFahad\b/g, '<span class="highlight-name" data-char="fahad">Fahad</span>');
                html = html.replace(/\bAamina\b/g, '<span class="highlight-name" data-char="aamina">Aamina</span>');

                p.innerHTML = html;
                p.setAttribute('data-highlighted', 'true');
            });
        });

        // Initialize popover listeners ONCE via delegation
        setupPopoverDelegation();
    }

    // ==========================================
    // 2. POPOVER SYSTEM (EVENT DELEGATION FIX)
    // ==========================================
    function setupPopoverDelegation() {
        let popover = document.getElementById('charPopover');
        
        if (!popover) {
            popover = document.createElement('div');
            popover.id = 'charPopover';
            popover.className = 'char-popover';
            popover.innerHTML = `<h4 id="charName"></h4><p id="charDesc"></p>`;
            document.body.appendChild(popover);
        }

        const popName = document.getElementById('charName');
        const popDesc = document.getElementById('charDesc');

        // Event delegation on document body to avoid re-binding memory leaks
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('.highlight-name');
            if (!target) return;

            const key = target.getAttribute('data-char');
            if (characterData[key]) {
                if (popName) popName.innerText = characterData[key].name;
                if (popDesc) popDesc.innerText = characterData[key].desc;

                const rect = target.getBoundingClientRect();
                const popoverWidth = 280;
                
                let leftPos = rect.left + (rect.width / 2) - (popoverWidth / 2);
                let topPos = rect.top - 80;

                if (leftPos < 10) leftPos = 10;
                if (topPos < 10) topPos = rect.bottom + 10;

                popover.style.left = `${leftPos}px`;
                popover.style.top = `${topPos}px`;
                popover.classList.add('active');
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('.highlight-name')) {
                popover.classList.remove('active');
            }
        });
    }

    autoHighlightCharacters();

    // ==========================================
    // 3. STATS & MENTIONS RECALCULATOR FUNCTION
    // ==========================================
    window.updateChapterStats = function() {
        const activePart = document.querySelector('.part-content.active') || document.querySelector('.story-body');
        const activeText = activePart ? (activePart.innerText || activePart.textContent || "") : "";
        const words = activeText.trim().split(/\s+/).filter(w => w.length > 0).length;
        
        const wordCountElement = document.getElementById('word-count');
        const readTimeElement = document.getElementById('read-time');

        if (wordCountElement) wordCountElement.innerText = `${words} Words`;
        if (readTimeElement) {
            const readTime = Math.ceil(words / 150) || 1;
            readTimeElement.innerText = `${readTime} Min Read`;
        }

        const fullStoryElement = document.querySelector('.story-body') || document.body;
        const fullText = fullStoryElement ? (fullStoryElement.innerText || fullStoryElement.textContent || "") : "";

        const fahadMatches = fullText.match(/\bFahad\b/gi);
        const aaminaMatches = fullText.match(/\bAamina\b/gi);

        const fahadElement = document.getElementById('fahad-mentions');
        const aaminaElement = document.getElementById('aamina-mentions');

        if (fahadElement) fahadElement.innerText = fahadMatches ? fahadMatches.length : 0;
        if (aaminaElement) aaminaElement.innerText = aaminaMatches ? aaminaMatches.length : 0;
    };

    window.updateChapterStats();

    // Live Scroll Progress Bar Listener
    const progressBar = document.getElementById("progress-bar");
    const sidebarPercent = document.getElementById("sidebar-scroll-percent");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = scrollHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100))) : 0;

        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
        if (sidebarPercent) {
            sidebarPercent.innerText = scrolled + "%";
        }
    });

    // ==========================================
    // 4. DRAWERS AND OVERLAY TOGGLE SYSTEM
    // ==========================================
    const openChapters = document.getElementById('openChapters');
    const openSettings = document.getElementById('openSettings');
    const closeChapters = document.getElementById('closeChapters');
    const closeSettings = document.getElementById('closeSettings');
    const chapterDrawer = document.getElementById('chapterDrawer');
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');

    function closeAllPanels() {
        if (chapterDrawer) chapterDrawer.classList.remove('active');
        if (settingsPanel) settingsPanel.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    if (openChapters) {
        openChapters.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllPanels();
            if (chapterDrawer) chapterDrawer.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }

    if (openSettings) {
        openSettings.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllPanels();
            if (settingsPanel) settingsPanel.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }

    if (closeChapters) closeChapters.addEventListener('click', closeAllPanels);
    if (closeSettings) closeSettings.addEventListener('click', closeAllPanels);
    if (overlay) overlay.addEventListener('click', closeAllPanels);

    // ==========================================
    // 5. BACK TO TOP & SCROLL PROGRESS
    // ==========================================
    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Ensure fixed floating Back To Top button exists
    let floatBtn = document.getElementById('floatingBackToTop');
    if (!floatBtn) {
        floatBtn = document.createElement('button');
        floatBtn.id = 'floatingBackToTop';
        floatBtn.className = 'floating-back-to-top';
        floatBtn.innerHTML = '↑ Top';
        floatBtn.title = 'Back to top';
        document.body.appendChild(floatBtn);
    }

    floatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollToTop();
    });

    document.querySelectorAll('.back-to-top-btn, #backToTopBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollToTop();
        });
    });

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;

        const progressBar = document.getElementById('progress-bar');
        const percentDisplay = document.getElementById('sidebar-scroll-percent');

        if (progressBar) progressBar.style.width = `${scrollPercent}%`;
        if (percentDisplay) percentDisplay.innerText = `${scrollPercent}%`;

        if (floatBtn) {
            if (scrollTop > 250) {
                floatBtn.classList.add('visible');
            } else {
                floatBtn.classList.remove('visible');
            }
        }
    });

    // ==========================================
    // 6. FOCUS MODE TOGGLE
    // ==========================================
    const focusBtn = document.getElementById('focusModeBtn');
    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
            document.body.classList.toggle('focus-mode');
            focusBtn.innerText = document.body.classList.contains('focus-mode') ? "✨ Normal" : "👁️ Focus";
        });
    }

    // ==========================================
    // 7. AUTO-BOOKMARK & RESUME SCROLL SYSTEM
    // ==========================================
    const currentChapterKey = "bookmark_" + window.location.pathname;
    const currentPartKey = "activePart_" + window.location.pathname;

    // Mark current chapter as read/visited
    localStorage.setItem("completed_" + window.location.pathname.split('/').pop(), "true");
    updateDrawerChapterBadges();

    function updateDrawerChapterBadges() {
        document.querySelectorAll('.chapter-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const filename = href.split('/').pop();
                if (localStorage.getItem("completed_" + filename)) {
                    if (!link.querySelector('.completion-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'completion-badge';
                        badge.style.cssText = "margin-left: auto; color: var(--accent-gold); font-size: 0.75rem; font-weight: bold;";
                        badge.textContent = "✔️ Read";
                        link.appendChild(badge);
                    }
                }
            }
        });
    }

    const savedPart = localStorage.getItem(currentPartKey);
    if (savedPart) {
        switchPart(parseInt(savedPart, 10));
    }

    const savedPosition = localStorage.getItem(currentChapterKey);
    if (savedPosition) {
        setTimeout(() => {
            window.scrollTo({
                top: parseFloat(savedPosition),
                behavior: "smooth"
            });
            showResumeToast();
        }, 300);
    }

    let isScrolling;
    window.addEventListener("scroll", () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            if (window.scrollY > 200) {
                localStorage.setItem(currentChapterKey, window.scrollY);
            }
        }, 200);
    });

    function showResumeToast() {
        const toast = document.createElement("div");
        toast.className = "resume-toast";
        toast.innerHTML = "📍 Welcome back! Jumping back to your last saved spot.";
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 100);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
});

// Global Theme Switchers
function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('selectedTheme', themeName);
}

function applyFont(fontName) {
    document.body.setAttribute('data-font', fontName);
    localStorage.setItem('selectedFont', fontName);
}

function applySize(sizeName) {
    document.body.setAttribute('data-size', sizeName);
    localStorage.setItem('selectedSize', sizeName);
}

function switchPart(partNumber) {
    const allParts = document.querySelectorAll('.part-content');
    const allTabs = document.querySelectorAll('.part-tab');

    allParts.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    allTabs.forEach(t => {
        t.classList.remove('active');
    });

    const targetPart = document.getElementById(`part-${partNumber}`);
    if (targetPart) {
        targetPart.classList.add('active');
        targetPart.style.display = 'block';
    }

    const matchingTabs = document.querySelectorAll(`.part-tab[onclick*="switchPart(${partNumber})"]`);
    matchingTabs.forEach(t => t.classList.add('active'));

    const currentChapterKey = "activePart_" + window.location.pathname;
    localStorage.setItem(currentChapterKey, partNumber);

    if (typeof window.scrollToTop === 'function') {
        window.scrollToTop();
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (typeof window.updateChapterStats === 'function') {
        window.updateChapterStats();
    }
}

// ==========================================
// 8. STORY CHOICE LOGIC
// ==========================================
function makeChoice(btnElement, option) {
    const parent = btnElement.closest('.story-choice-box');
    const resultBox = parent.querySelector('.choice-result');
    const btnContainer = parent.querySelector('.choice-buttons');

    btnContainer.style.display = 'none';
    resultBox.style.display = 'block';

    if (option === 'opt1') {
        resultBox.innerHTML = "<b>Nateeja:</b> Fahad ne chupchap andhere mein kadam rakha. Ek ajab si thandak ne use gher liya...";
    } else {
        resultBox.innerHTML = "<b>Nateeja:</b> Roshni ki taraf badhte hi Fahad ko zameen par ek purana envelope mila...";
    }
}

// ==========================================
// 9. ULTRA-SOFT RELAXING NOVEL MUSIC & AMBIENT ENGINE
// ==========================================
// Ultra-Soft Warm Ambient Music Engine (Filtered & Gentle)
let ambientCtx = null;
let activeOscillators = [];
let isChapterAudioPlaying = false;

function initAmbientCtx() {
    if (!ambientCtx) {
        ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ambientCtx.state === 'suspended') {
        ambientCtx.resume();
    }
}

window.toggleAmbient = function(type, btn) {
    const allBtns = document.querySelectorAll('.audio-toggle-btn, .ambient-btn-group button, #soundBtn');

    if (isChapterAudioPlaying) {
        stopAllCalmingAudio();
        allBtns.forEach(b => b.classList.remove('active'));
        return;
    }

    stopAllCalmingAudio();

    try {
        initAmbientCtx();

        // Create Master Gain & Lowpass Filter to eliminate sharp beep tones
        const masterGain = ambientCtx.createGain();
        masterGain.gain.setValueAtTime(0.001, ambientCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.02, ambientCtx.currentTime + 2.5);

        const filter = ambientCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, ambientCtx.currentTime);

        filter.connect(masterGain);
        masterGain.connect(ambientCtx.destination);

        // Warm, deep ambient chord frequencies (A1, A2, E3, C#3)
        const warmNotes = [55.0, 110.0, 138.6, 164.8];

        warmNotes.forEach((freq, idx) => {
            const osc = ambientCtx.createOscillator();
            const gain = ambientCtx.createGain();
            const lfo = ambientCtx.createOscillator();
            const lfoGain = ambientCtx.createGain();

            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, ambientCtx.currentTime);

            lfo.frequency.setValueAtTime(0.03 + (idx * 0.01), ambientCtx.currentTime);
            lfoGain.gain.setValueAtTime(0.004, ambientCtx.currentTime);

            lfo.connect(gain.gain);
            gain.gain.setValueAtTime(0.006, ambientCtx.currentTime);

            osc.connect(gain);
            gain.connect(filter);

            osc.start();
            lfo.start();

            activeOscillators.push(osc, lfo, gain, lfoGain);
        });

        activeOscillators.push(filter, masterGain);
        isChapterAudioPlaying = true;
        allBtns.forEach(b => b.classList.add('active'));
        if (btn) btn.classList.add('active');
    } catch (err) {
        console.error("Audio error:", err);
    }
};

function stopAllCalmingAudio() {
    activeOscillators.forEach(node => {
        try {
            if (node.stop) node.stop();
            if (node.disconnect) node.disconnect();
        } catch (e) {}
    });
    activeOscillators = [];
    isChapterAudioPlaying = false;
}

// ==========================================
// 10. QUIZ CHECKER (4 OPTIONS & 3 ATTEMPTS)
// ==========================================
const quizAttemptStore = {};

function checkQuizAnswer(btnElement, isCorrect) {
    const card = btnElement.closest('.story-quiz-card');
    const quizId = card.id || 'defaultQuiz';
    const correctMsg = card.querySelector('.correct-msg');
    const wrongMsg = card.querySelector('.wrong-msg');
    let blockMsg = card.querySelector('.block-msg');
    const optionsGroup = card.querySelector('.quiz-options');

    const nextContent = card.nextElementSibling;

    if (!quizAttemptStore[quizId]) {
        quizAttemptStore[quizId] = { attempts: 0, blockedUntil: null };
    }

    const state = quizAttemptStore[quizId];

    if (state.blockedUntil && Date.now() < state.blockedUntil) {
        return;
    }

    if (isCorrect) {
        if (wrongMsg) wrongMsg.style.display = 'none';
        if (blockMsg) blockMsg.style.display = 'none';
        if (correctMsg) correctMsg.style.display = 'block';
        if (optionsGroup) optionsGroup.style.display = 'none';

        if (nextContent && nextContent.classList.contains('hidden-content')) {
            nextContent.classList.remove('hidden-content');
            nextContent.style.animation = 'fadeIn 0.5s ease';

            if (typeof window.updateChapterStats === 'function') {
                window.updateChapterStats();
            }
        }
    } else {
        state.attempts++;

        if (state.attempts >= 3) {
            state.blockedUntil = Date.now() + 120000; // 2 Minutes Lock
            
            if (wrongMsg) wrongMsg.style.display = 'none';

            if (!blockMsg) {
                blockMsg = document.createElement('div');
                blockMsg.className = 'quiz-feedback block-msg';
                card.appendChild(blockMsg);
            }

            blockMsg.style.display = 'block';
            startLockoutTimer(card, quizId, blockMsg, optionsGroup, 120);
        } else {
            card.classList.remove('shake-card');
            void card.offsetWidth; 
            card.classList.add('shake-card');

            if (wrongMsg) {
                wrongMsg.style.display = 'block';
                const countSpan = wrongMsg.querySelector('.attempts-count');
                if (countSpan) {
                    countSpan.innerText = 3 - state.attempts;
                }
            }
        }
    }
}

function retryQuiz(btnElement) {
    const card = btnElement.closest('.story-quiz-card');
    const wrongMsg = card.querySelector('.wrong-msg');
    if (wrongMsg) wrongMsg.style.display = 'none';
}

function startLockoutTimer(card, quizId, blockMsgEl, optionsGroup, seconds) {
    optionsGroup.style.pointerEvents = 'none';
    optionsGroup.style.opacity = '0.4';

    let timeLeft = seconds;

    const updateText = () => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        blockMsgEl.innerHTML = `🔒 <b>Limit Reached!</b> Aapne 3 galat attempts kar liye hain. Kripya <b><span class="timer-display">${formattedTime}</span></b> wait karein.`;
    };

    updateText();

    const interval = setInterval(() => {
        timeLeft--;
        updateText();

        if (timeLeft <= 0) {
            clearInterval(interval);
            quizAttemptStore[quizId].attempts = 0;
            quizAttemptStore[quizId].blockedUntil = null;

            blockMsgEl.style.display = 'none';
            optionsGroup.style.pointerEvents = 'auto';
            optionsGroup.style.opacity = '1';
        }
    }, 1000);
}

// ==========================================
// FLOATING TEXT SELECTION & READER HIGHLIGHTER SYSTEM
// ==========================================
let userHighlights = [];

function getPageHighlightKey() {
    return "user_highlights_" + window.location.pathname;
}

function loadSavedUserHighlights() {
    try {
        const saved = localStorage.getItem(getPageHighlightKey());
        if (saved) userHighlights = JSON.parse(saved);
    } catch(e) { userHighlights = []; }

    if (!Array.isArray(userHighlights)) userHighlights = [];
    applyUserHighlightsToDOM();
}

function applyUserHighlightsToDOM() {
    if (!userHighlights.length) return;
    const bodyElements = document.querySelectorAll('.story-body p, .part-content p, .hero-excerpt, .about-content p');

    userHighlights.forEach(textSnippet => {
        if (!textSnippet || textSnippet.length < 3) return;
        bodyElements.forEach(p => {
            if (p.textContent.includes(textSnippet) && !p.querySelector(`mark.user-highlight[data-hl-text="${CSS.escape(textSnippet)}"]`)) {
                const regex = new RegExp(`(${textSnippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
                p.innerHTML = p.innerHTML.replace(regex, `<mark class="user-highlight" data-hl-text="${textSnippet}" title="Click to remove highlight">$1</mark>`);
            }
        });
    });
}

function saveUserHighlight(textSnippet) {
    if (!textSnippet || textSnippet.length < 3) return;
    if (!userHighlights.includes(textSnippet)) {
        userHighlights.push(textSnippet);
        localStorage.setItem(getPageHighlightKey(), JSON.stringify(userHighlights));
    }
    applyUserHighlightsToDOM();
}

function removeUserHighlight(textSnippet) {
    userHighlights = userHighlights.filter(t => t !== textSnippet);
    localStorage.setItem(getPageHighlightKey(), JSON.stringify(userHighlights));
    
    document.querySelectorAll(`mark.user-highlight[data-hl-text="${CSS.escape(textSnippet)}"]`).forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
}

// Click to remove highlight delegation
document.addEventListener('click', (e) => {
    const markEl = e.target.closest('mark.user-highlight');
    if (markEl) {
        e.stopPropagation();
        const textSnippet = markEl.getAttribute('data-hl-text') || markEl.textContent.trim();
        if (confirm("Remove this highlight?")) {
            removeUserHighlight(textSnippet);
        }
    }
});

// Floating selection toolbar
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";
    
    let shareBar = document.getElementById('textShareBar');
    if (!shareBar) {
        shareBar = document.createElement('div');
        shareBar.id = 'textShareBar';
        shareBar.className = 'text-share-bar';
        shareBar.innerHTML = `
            <button id="shareWaBtn">💬 WhatsApp</button>
            <button id="copyQuoteBtn">📋 Copy</button>
            <button id="highlightBtn">🖍️ Highlight</button>
        `;
        document.body.appendChild(shareBar);
    }
    
    if (selectedText.length > 4 && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        let leftPos = rect.left + (rect.width / 2) - 120;
        let topPos = rect.top - 50;
        if (leftPos < 10) leftPos = 10;
        if (topPos < 10) topPos = rect.bottom + 10;

        shareBar.style.left = `${leftPos}px`;
        shareBar.style.top = `${topPos}px`;
        shareBar.classList.add('active');
        
        const shareWa = document.getElementById('shareWaBtn');
        const copyBtn = document.getElementById('copyQuoteBtn');
        const hlBtn = document.getElementById('highlightBtn');

        if (shareWa) {
            shareWa.onclick = (e) => {
                e.stopPropagation();
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent('"' + selectedText + '" — Parda Aur Mijaz Novel')}`;
                window.open(url, '_blank');
            };
        }
        
        if (copyBtn) {
            copyBtn.onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`"${selectedText}" — Parda Aur Mijaz Novel`);
                alert("Quote copied!");
                shareBar.classList.remove('active');
            };
        }

        if (hlBtn) {
            hlBtn.onclick = (e) => {
                e.stopPropagation();
                saveUserHighlight(selectedText);
                selection.removeAllRanges();
                shareBar.classList.remove('active');
            };
        }
    } else {
        if (shareBar) shareBar.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadSavedUserHighlights();
});

// ==========================================
// 11. CHAPTER REACTION WIDGET LOGIC
// ==========================================
window.reactToChapter = function(type, btn) {
    const parent = btn.closest('.chapter-reactions-widget');
    if (!parent) return;
    
    const allBtns = parent.querySelectorAll('.reaction-btn');
    const pageKey = "reaction_" + window.location.pathname;

    allBtns.forEach(b => b.classList.remove('reacted'));
    btn.classList.add('reacted');

    localStorage.setItem(pageKey, type);
};

window.initChapterReactions = function() {
    const pageKey = "reaction_" + window.location.pathname;
    const savedReaction = localStorage.getItem(pageKey);
    if (savedReaction) {
        const matchingBtn = document.querySelector(`.reaction-btn[onclick*="${savedReaction}"]`);
        if (matchingBtn) matchingBtn.classList.add('reacted');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.initChapterReactions === 'function') {
        window.initChapterReactions();
    }
});

// ==========================================
// SECRET PASSWORD LOCK SYSTEM (Chapters 2 to 12)
// Secret Password: kaif@431
// ==========================================
const SECRET_NOVEL_PASSWORD = "kaif@431";

function isNovelUnlocked() {
    return localStorage.getItem("novel_unlocked") === "true";
}

function promptNovelUnlock(targetHref) {
    if (isNovelUnlocked()) {
        if (targetHref) window.location.href = targetHref;
        return true;
    }

    let lockModal = document.getElementById("novelLockModal");
    if (!lockModal) {
        lockModal = document.createElement("div");
        lockModal.id = "novelLockModal";
        lockModal.className = "novel-lock-modal active";
        lockModal.style.cssText = "position: fixed; inset: 0; background: rgba(12, 9, 7, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 1rem;";
        lockModal.innerHTML = `
            <div class="novel-lock-card" style="background: #16100c; border: 2px solid #e2b857; border-radius: 20px; padding: 2.5rem 1.8rem; width: 100%; max-width: 440px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(226,184,87,0.3);">
                <div class="novel-lock-icon" style="font-size: 3rem; margin-bottom: 0.8rem;">🔒</div>
                <div class="novel-lock-title" style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #e2b857; margin-bottom: 0.4rem;">Chapters 02–12 Locked</div>
                <div class="novel-lock-desc" style="font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #a09585; margin-bottom: 1.5rem; line-height: 1.5;">
                    Chapter 01 is Free to read! Aage ke baaki chapters padhne ke liye Secret Access Password enter karein:
                </div>
                <form id="novelLockForm" class="novel-lock-form" style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="password" id="novelLockInput" class="novel-lock-input" placeholder="Enter Secret Password" required autocomplete="off" style="width: 100%; padding: 0.9rem 1.2rem; border-radius: 12px; border: 1px solid #3a2e22; background: #0c0907; color: #f4ede2; font-family: 'Inter', sans-serif; font-size: 0.95rem; text-align: center; letter-spacing: 2px; outline: none;">
                    <button type="submit" class="novel-lock-btn" style="width: 100%; padding: 0.9rem; border-radius: 12px; border: none; background: #e2b857; color: #000000; font-family: 'Inter', sans-serif; font-weight: bold; font-size: 0.95rem; cursor: pointer;">Unlock All Chapters 🔓</button>
                </form>
                <div id="novelLockError" class="novel-lock-error" style="color: #ff6b6b; font-size: 0.82rem; font-family: 'Inter', sans-serif; margin-top: 0.8rem; display: none;">❌ Galat Password! Please enter valid password.</div>
                <button type="button" onclick="closeLockModal()" style="background: none; border: none; color: #a09585; margin-top: 1rem; cursor: pointer; font-size: 0.8rem; text-decoration: underline;">Cancel / Return</button>
            </div>
        `;
        document.body.appendChild(lockModal);

        const lockForm = document.getElementById("novelLockForm");
        lockForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputVal = document.getElementById("novelLockInput").value.trim();
            const errorMsg = document.getElementById("novelLockError");

            if (inputVal.toLowerCase() === SECRET_NOVEL_PASSWORD.toLowerCase() || inputVal === SECRET_NOVEL_PASSWORD) {
                localStorage.setItem("novel_unlocked", "true");
                lockModal.style.display = "none";
                alert("🎉 Success! All Chapters are now Unlocked!");
                updateChapterLockBadges();
                
                const pendingUrl = lockModal.getAttribute("data-pending-url");
                if (pendingUrl) {
                    window.location.href = pendingUrl;
                } else if (window.location.pathname.includes("chapter") && !window.location.pathname.includes("chapter1.html")) {
                    window.location.reload();
                }
            } else {
                if (errorMsg) {
                    errorMsg.style.display = "block";
                    errorMsg.innerText = "❌ Incorrect Password! Try again.";
                }
            }
        });
    }

    if (targetHref) {
        lockModal.setAttribute("data-pending-url", targetHref);
    }
    
    lockModal.style.display = "flex";
    const inputField = document.getElementById("novelLockInput");
    if (inputField) {
        inputField.value = "";
        inputField.focus();
    }
    return false;
}

window.closeLockModal = function() {
    const lockModal = document.getElementById("novelLockModal");
    if (lockModal) lockModal.style.display = "none";
};

// Check direct URL access to Chapters 2 to 12
function enforcePageAccessLock() {
    const currentPath = window.location.pathname;
    const isLockedChapterPage = /chapter([2-9]|1[0-2])\.html$/i.test(currentPath);

    if (isLockedChapterPage && !isNovelUnlocked()) {
        document.addEventListener("DOMContentLoaded", () => {
            promptNovelUnlock();
        });
    }
}

enforcePageAccessLock();

// Update UI lock badges across home & drawer links
function updateChapterLockBadges() {
    const unlocked = isNovelUnlocked();

    document.querySelectorAll(".chapter-link").forEach(link => {
        const href = link.getAttribute("href") || "";
        const isLockedChapter = /chapter([2-9]|1[0-2])\.html$/i.test(href);

        if (isLockedChapter) {
            let badge = link.querySelector(".lock-badge");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "lock-badge";
                badge.style.cssText = "margin-left: auto; font-size: 0.75rem; font-weight: bold;";
                link.appendChild(badge);
            }
            if (unlocked) {
                badge.style.color = "#52b788";
                badge.textContent = "🔓 Unlocked";
            } else {
                badge.style.color = "var(--accent-gold)";
                badge.textContent = "🔒 Locked";
            }
        }
    });
}

// Click Interceptor & Navigation for all chapter links
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href*='chapter']");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (!href || href === "#" || href.startsWith("#")) return;

    const isLockedChapter = /chapter([2-9]|1[0-2])\.html$/i.test(href);

    if (isLockedChapter && !isNovelUnlocked()) {
        e.preventDefault();
        e.stopPropagation();
        promptNovelUnlock(href);
    } else {
        e.preventDefault();
        if (typeof window.closeAllDrawers === 'function') window.closeAllDrawers();
        window.location.assign(href);
    }
}, true);

document.addEventListener("DOMContentLoaded", () => {
    updateChapterLockBadges();
});