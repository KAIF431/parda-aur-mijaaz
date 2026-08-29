// Global Theme, Font & Text Size Functions
window.applyTheme = function(themeName) {
    if (!themeName) return;
    const t = (themeName === 'default') ? 'dark' : themeName;
    document.documentElement.setAttribute('data-theme', t);
    if (document.body) document.body.setAttribute('data-theme', t);
    localStorage.setItem('selectedTheme', t);
    localStorage.setItem('parda_theme', t);
};

window.applyFont = function(fontName) {
    if (!fontName) return;
    document.documentElement.setAttribute('data-font', fontName);
    if (document.body) document.body.setAttribute('data-font', fontName);
    localStorage.setItem('selectedFont', fontName);
    localStorage.setItem('parda_font', fontName);
};

window.applySize = function(sizeName) {
    if (!sizeName) return;
    document.documentElement.setAttribute('data-size', sizeName);
    if (document.body) document.body.setAttribute('data-size', sizeName);
    localStorage.setItem('selectedSize', sizeName);
    localStorage.setItem('parda_size', sizeName);
};

function loadSavedHomeHighlights() {
    try {
        const saved = localStorage.getItem("user_highlights_" + window.location.pathname);
        if (!saved) return;
        const highlights = JSON.parse(saved);
        if (!Array.isArray(highlights)) return;
        const bodyElements = document.querySelectorAll('.hero-excerpt p, .about-content p, .section-subtitle, .quote-text, .m-desc');
        highlights.forEach(textSnippet => {
            if (!textSnippet || textSnippet.length < 3) return;
            bodyElements.forEach(p => {
                if (p.textContent.includes(textSnippet) && !p.querySelector(`mark.user-highlight[data-hl-text="${CSS.escape(textSnippet)}"]`)) {
                    const regex = new RegExp(`(${textSnippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
                    p.innerHTML = p.innerHTML.replace(regex, `<mark class="user-highlight" data-hl-text="${textSnippet}" title="Click to remove highlight">$1</mark>`);
                }
            });
        });
    } catch(e) {}
}

// Global Drawer & Settings Toggles
window.closeAllDrawers = function() {
    const panel = document.getElementById('settingsPanel');
    const drawer = document.getElementById('chapterDrawer');
    const overlay = document.getElementById('settingsOverlay');
    const modal = document.getElementById('contactModal');

    if (panel) {
        panel.classList.remove('active');
        panel.style.cssText = "position: fixed; top: 0; right: -420px !important; width: 380px; max-width: 100vw; height: 100vh; background: var(--bg-drawer); z-index: 999999; padding: 3rem 2rem; overflow-y: auto; transition: right 0.4s ease;";
    }
    if (drawer) {
        drawer.classList.remove('active');
        drawer.style.cssText = "position: fixed; top: 0; left: -420px !important; width: 380px; max-width: 100vw; height: 100vh; background: var(--bg-drawer); z-index: 999999; padding: 3rem 2rem; overflow-y: auto; transition: left 0.4s ease;";
    }
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 999998; opacity: 0 !important; pointer-events: none !important;";
    }
    if (modal) {
        modal.classList.remove('active');
        modal.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000; opacity: 0 !important; pointer-events: none !important;";
    }
};

window.openSettings = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.closeAllDrawers();
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    if (panel) {
        panel.classList.add('active');
        panel.style.cssText = "position: fixed; top: 0; right: 0px !important; width: 380px; max-width: 100vw; height: 100vh; background: var(--bg-drawer); z-index: 999999 !important; padding: 3rem 2rem; overflow-y: auto; display: block !important; box-shadow: -10px 0 35px rgba(0,0,0,0.85); transition: right 0.4s ease;";
    }
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.cssText = "position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); z-index: 999998 !important; opacity: 1 !important; pointer-events: all !important;";
    }
};

window.openChapters = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.closeAllDrawers();
    const drawer = document.getElementById('chapterDrawer');
    const overlay = document.getElementById('settingsOverlay');
    if (drawer) {
        drawer.classList.add('active');
        drawer.style.cssText = "position: fixed; top: 0; left: 0px !important; width: 380px; max-width: 100vw; height: 100vh; background: var(--bg-drawer); z-index: 999999 !important; padding: 3rem 2rem; overflow-y: auto; display: block !important; box-shadow: 10px 0 35px rgba(0,0,0,0.85); transition: left 0.4s ease;";
    }
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.cssText = "position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); z-index: 999998 !important; opacity: 1 !important; pointer-events: all !important;";
    }
};

window.openContact = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.closeAllDrawers();
    const modal = document.getElementById('contactModal');
    const overlay = document.getElementById('settingsOverlay');
    if (modal) {
        modal.classList.add('active');
        modal.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000; opacity: 1 !important; pointer-events: all !important; display: flex !important; align-items: center; justify-content: center;";
    }
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 999998 !important; opacity: 1 !important; pointer-events: all !important;";
    }
};

// Theme, Font & Text Scaling Event Listeners
document.addEventListener("click", (e) => {
    const themeBtn = e.target.closest("[data-theme]");
    if (themeBtn) {
        e.preventDefault();
        let theme = themeBtn.getAttribute("data-theme");
        if (theme === 'default') theme = 'dark';
        window.applyTheme(theme);
    }

    const fontBtn = e.target.closest("[data-font]");
    if (fontBtn) {
        e.preventDefault();
        const font = fontBtn.getAttribute("data-font");
        window.applyFont(font);
    }

    const sizeBtn = e.target.closest("[data-size]");
    if (sizeBtn) {
        e.preventDefault();
        const size = sizeBtn.getAttribute("data-size");
        window.applySize(size);
    }
});

// ==========================================
// SECRET PASSWORD LOCK SYSTEM
// ==========================================

const SECRET_NOVEL_PASSWORD = "kaif@431";

function isNovelUnlocked() {
    return false;
}

function promptNovelUnlock(targetHref) {

    let lockModal = document.getElementById("novelLockModal");

    if (!lockModal) {

        lockModal = document.createElement("div");
        lockModal.id = "novelLockModal";
        lockModal.className = "novel-lock-modal active";

        lockModal.style.cssText = "position: fixed; inset: 0; background: rgba(12, 9, 7, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 1rem; pointer-events: auto;";

        lockModal.innerHTML = `
            <div class="novel-lock-card" style="background: #16100c; border: 2px solid #e2b857; border-radius: 20px; padding: 2.5rem 1.8rem; width: 100%; max-width: 440px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(226,184,87,0.3);">

                <div class="novel-lock-icon" style="font-size: 3rem; margin-bottom: 0.8rem;">
                    🔒
                </div>

                <div class="novel-lock-title" style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #e2b857; margin-bottom: 0.4rem;">
                    Chapter Locked
                </div>

                <div class="novel-lock-desc" style="font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #a09585; margin-bottom: 0.8rem; line-height: 1.5;">
                    This chapter is protected by a Secret Access Password.
                </div>

                <div style="font-family: 'Inter', sans-serif; font-size: 0.82rem; color: #e2b857; margin-bottom: 1.5rem; line-height: 1.5;">
                    If you are important person for Kaif, you know the password.
                </div>

                <form id="novelLockForm" class="novel-lock-form" style="display: flex; flex-direction: column; gap: 1rem;">

                    <input
                        type="password"
                        id="novelLockInput"
                        class="novel-lock-input"
                        placeholder="Enter Secret Password"
                        required
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="none"
                        spellcheck="false"
                        style="width: 100%; box-sizing: border-box; padding: 0.9rem 1.2rem; border-radius: 12px; border: 1px solid #3a2e22; background: #0c0907; color: #f4ede2; font-family: 'Inter', sans-serif; font-size: 16px; text-align: center; letter-spacing: 2px; outline: none;"
                    >

                    <button
                        type="submit"
                        class="novel-lock-btn"
                        style="width: 100%; padding: 0.9rem; border-radius: 12px; border: none; background: #e2b857; color: #000000; font-family: 'Inter', sans-serif; font-weight: bold; font-size: 0.95rem; cursor: pointer; touch-action: manipulation; position: relative; z-index: 1000000; pointer-events: auto;"
                    >
                        Unlock Chapter 🔓
                    </button>

                </form>

                <div
                    id="novelLockError"
                    class="novel-lock-error"
                    style="color: #ff6b6b; font-size: 0.82rem; font-family: 'Inter', sans-serif; margin-top: 0.8rem; display: none;"
                >
                    ❌ Incorrect Password! Try again.
                </div>

                <button
                    type="button"
                    onclick="closeLockModal()"
                    style="background: none; border: none; color: #a09585; margin-top: 1rem; cursor: pointer; font-size: 0.8rem; text-decoration: underline; padding: 10px; touch-action: manipulation; position: relative; z-index: 1000000; pointer-events: auto;"
                >
                    Cancel / Return
                </button>

            </div>
        `;

        document.body.appendChild(lockModal);

        const lockForm =
            document.getElementById("novelLockForm");

        const unlockButton =
            document.querySelector("#novelLockModal .novel-lock-btn");

        function checkNovelPassword(e) {

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            const inputField =
                document.getElementById("novelLockInput");

            const errorMsg =
                document.getElementById("novelLockError");

            if (!inputField) return;

            const inputVal =
                inputField.value.trim();

            if (
                inputVal.toLowerCase() ===
                SECRET_NOVEL_PASSWORD.toLowerCase()
            ) {

                const pendingUrl =
                    lockModal.getAttribute("data-pending-url");

                lockModal.style.display = "none";

                if (pendingUrl) {
                    window.location.href = pendingUrl;
                } else {
                    window.location.reload();
                }

            } else {

                if (errorMsg) {
                    errorMsg.style.display = "block";
                    errorMsg.innerText =
                        "❌ Incorrect Password! Try again.";
                }

                inputField.value = "";

                setTimeout(function() {
                    inputField.focus();
                }, 50);
            }

            return false;
        }

        // PC + Mobile
        if (unlockButton) {

            unlockButton.addEventListener(
                "pointerup",
                checkNovelPassword,
                false
            );

        }

        // Keyboard / Enter
        if (lockForm) {

            lockForm.addEventListener(
                "submit",
                checkNovelPassword,
                false
            );

        }
    }

    if (targetHref) {
        lockModal.setAttribute(
            "data-pending-url",
            targetHref
        );
    }

    lockModal.style.display = "flex";

    const inputField =
        document.getElementById("novelLockInput");

    const errorMsg =
        document.getElementById("novelLockError");

    if (errorMsg) {
        errorMsg.style.display = "none";
    }

    if (inputField) {
        inputField.value = "";

        setTimeout(function() {
            inputField.focus();
        }, 100);
    }

    return false;
}

window.closeLockModal = function() {

    const lockModal =
        document.getElementById("novelLockModal");

    if (lockModal) {
        lockModal.style.display = "none";
    }
};


// ==========================================
// LOCK DIRECT CHAPTER PAGES
// ==========================================

function enforcePageAccessLock() {

    const currentPath =
        window.location.pathname;

    const isLockedChapterPage =
        /chapter([2-9]|1[0-2])\.html$/i.test(
            currentPath
        );

    if (isLockedChapterPage) {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                function() {
                    promptNovelUnlock();
                }
            );

        } else {

            promptNovelUnlock();
        }
    }
}

enforcePageAccessLock();


// ==========================================
// CHAPTER LOCK BADGES
// ==========================================

function updateChapterLockBadges() {

    document
        .querySelectorAll(".chapter-link")
        .forEach(function(link) {

            const href =
                link.getAttribute("href") || "";

            const isLockedChapter =
                /chapter([2-9]|1[0-2])\.html$/i.test(
                    href
                );

            if (!isLockedChapter) return;

            let badge =
                link.querySelector(".lock-badge");

            if (!badge) {

                badge =
                    document.createElement("span");

                badge.className = "lock-badge";

                badge.style.cssText =
                    "margin-left: auto; font-size: 0.75rem; font-weight: bold;";

                link.appendChild(badge);
            }

            badge.style.color =
                "var(--accent-gold)";

            badge.textContent =
                "🔒 Locked";
        });
}


// ==========================================
// CHAPTER NAVIGATION LOCK
// ==========================================

document.addEventListener("click", function(e) {

    const link =
        e.target.closest(
            "a[href*='chapter'], .chapter-link"
        );

    if (!link) return;

    const href =
        link.getAttribute("href") || "";

    if (
        !href ||
        href === "#" ||
        href.startsWith("#")
    ) {
        return;
    }

    const isLockedChapter =
        /chapter([2-9]|1[0-2])\.html$/i.test(
            href
        );

    if (isLockedChapter) {

        e.preventDefault();
        e.stopPropagation();

        promptNovelUnlock(href);
    }

});

document.addEventListener("DOMContentLoaded", () => {
    loadSavedHomeHighlights();
    updateChapterLockBadges();
    loadComments();

    const commentForm = document.getElementById("commentForm");
    if (commentForm) {
        commentForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("reviewerName");
            const emailInput = document.getElementById("reviewerEmail");
            const messageInput = document.getElementById("reviewerMessage");
            const submitBtn = commentForm.querySelector('button[type="submit"]');

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const message = messageInput ? messageInput.value.trim() : "";

            if (!name || !message) {
                alert("Kripya apna Naam aur Message dono bharein!");
                return;
            }

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Posting...";
            submitBtn.disabled = true;

            const newComment = {
                name: name,
                message: message,
                date: new Date().toLocaleDateString()
            };

            saveCommentToLocal(newComment);
            renderComment(newComment);

            const formData = new FormData();
            formData.append("access_key", "78b08615-65ca-4c89-a320-b21b236bba26");
            formData.append("subject", "New Comment on Parda Aur Mijaz");
            formData.append("name", name);
            formData.append("email", email || "Not Provided");
            formData.append("message", message);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Aapka comment successfully post ho gaya hai!");
                    commentForm.reset();
                } else {
                    alert("Screen par comment add ho gaya hai!");
                }
            })
            .catch(error => {
                console.error("Error submitting comment:", error);
                alert("Screen par comment add ho gaya hai!");
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});

function saveCommentToLocal(commentObj) {
    let comments = JSON.parse(localStorage.getItem("parda_comments")) || [];
    comments.push(commentObj);
    localStorage.setItem("parda_comments", JSON.stringify(comments));
}

function renderComment(commentObj) {
    const commentsList = document.getElementById("commentsList");
    if (!commentsList) return;

    const commentDiv = document.createElement("div");
    commentDiv.className = "comment-item";
    commentDiv.innerHTML = `
        <div class="comment-header">
            <strong>${escapeHTML(commentObj.name)}</strong>
        </div>
        <p>${escapeHTML(commentObj.message)}</p>
    `;
    commentsList.prepend(commentDiv);
}

function loadComments() {
    let comments = JSON.parse(localStorage.getItem("parda_comments")) || [];
    comments.forEach(comment => {
        renderComment(comment);
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'8
        }[tag] || tag)
    );
}