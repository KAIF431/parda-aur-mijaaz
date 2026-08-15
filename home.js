// Bulletproof Global Drawer & Settings Toggles
window.closeAllDrawers = function() {
    document.querySelectorAll('.chapter-drawer, .settings-panel, .contact-modal, .settings-overlay').forEach(el => {
        el.classList.remove('active');
    });
};

window.openSettings = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.closeAllDrawers();
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    if (panel) panel.classList.add('active');
    if (overlay) overlay.classList.add('active');
};

window.openChapters = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.closeAllDrawers();
    const drawer = document.getElementById('chapterDrawer');
    const overlay = document.getElementById('settingsOverlay');
    if (drawer) drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
};

window.openContact = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.closeAllDrawers();
    const modal = document.getElementById('contactModal');
    const overlay = document.getElementById('settingsOverlay');
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
    loadSavedHomeHighlights();
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

// Click Interceptor for all locked chapter links
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href*='chapter']");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const isLockedChapter = /chapter([2-9]|1[0-2])\.html$/i.test(href);

    if (isLockedChapter && !isNovelUnlocked()) {
        e.preventDefault();
        e.stopPropagation();
        promptNovelUnlock(href);
    }
}, true);

document.addEventListener("DOMContentLoaded", () => {
    updateChapterLockBadges();
    
    // 1. Storage se purane comments load karna
    loadComments();

    // 2. Comment Form Submit Event Handle karna
    const commentForm = document.getElementById("commentForm");
    
    if (commentForm) {
        commentForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Page refresh hone se rokna

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

            // Button ko disable karke Loading text dikhana
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Posting...";
            submitBtn.disabled = true;

            // Naye Comment ka object
            const newComment = {
                name: name,
                message: message,
                date: new Date().toLocaleDateString()
            };

            // Instant LocalStorage & Screen par dikhana
            saveCommentToLocal(newComment);
            renderComment(newComment);

            // Web3Forms API ko mail bhejna (Backend Sync)
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
                    alert("Screen par comment add ho gaya hai, lekin backend sync me issue aaya.");
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

// Helper Function: LocalStorage me save karne ke liye
function saveCommentToLocal(commentObj) {
    let comments = JSON.parse(localStorage.getItem("parda_comments")) || [];
    comments.push(commentObj);
    localStorage.getItem("parda_comments", JSON.stringify(comments));
    localStorage.setItem("parda_comments", JSON.stringify(comments));
}

// Helper Function: Screen par comment render karne ke liye
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
    
    // Naya comment list ke sabse upar dikhane ke liye prepend use kiya hai
    commentsList.prepend(commentDiv);
}

// Helper Function: LocalStorage se sare saved comments screen par load karne ke liye
function loadComments() {
    let comments = JSON.parse(localStorage.getItem("parda_comments")) || [];
    comments.forEach(comment => {
        renderComment(comment);
    });
}

// XSS Protection ke liye Security Helper
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
