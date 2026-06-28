// Default Configuration
const DEFAULT_API_KEY = "AQ.Ab8RN6IG_1YmPjHQVlpax6sXn3A0P2ZWU8o_p9yYFTSRNIJopg";
const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_TEMPERAMENT = "rude";
const DEFAULT_TEMPERATURE = 0.4;

// DSA Prompt templates for code injection
const TOPIC_TEMPLATES = {
    general: `// Data Structures & Algorithms Problem Template\n// Goal: Solve the problem optimally\n\nfunction solve(input) {\n    // Write your algorithmic solution here\n}`,
    arrays: `// Arrays & Strings Template: Sliding Window / Two Pointers\n\nfunction slidingWindow(arr) {\n    let left = 0;\n    let currentSum = 0;\n    let maxLength = 0;\n    \n    for (let right = 0; right < arr.length; right++) {\n        // Expand the window\n        currentSum += arr[right];\n        \n        // Contract the window if constraint is violated\n        while (/* condition */ false) {\n            currentSum -= arr[left];\n            left++;\n        }\n        \n        maxLength = Math.max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}`,
    linkedlists: `// Linked List Node Definition & Utility\n\nclass ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\n// Reverse a Linked List (Iterative)\nfunction reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr !== null) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
    stacksqueues: `// Custom Stack Implementation using Array\nclass Stack {\n    constructor() {\n        this.items = [];\n    }\n    push(element) { this.items.push(element); }\n    pop() { return this.items.length === 0 ? "Underflow" : this.items.pop(); }\n    peek() { return this.items[this.items.length - 1]; }\n    isEmpty() { return this.items.length === 0; }\n}`,
    trees: `// Binary Tree Node & DFS Traversals\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction inorderTraversal(root) {\n    const res = [];\n    function traverse(node) {\n        if (!node) return;\n        traverse(node.left);\n        res.push(node.val);\n        traverse(node.right);\n    }\n    traverse(root);\n    return res;\n}`,
    graphs: `// Graph Representation (Adjacency List) & BFS\n\nclass Graph {\n    constructor() {\n        this.adjacencyList = {};\n    }\n    addVertex(vertex) {\n        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];\n    }\n    addEdge(v1, v2) {\n        this.adjacencyList[v1].push(v2);\n        this.adjacencyList[v2].push(v1);\n    }\n    bfs(start) {\n        const queue = [start];\n        const result = [];\n        const visited = { [start]: true };\n        while (queue.length) {\n            let currentVertex = queue.shift();\n            result.push(currentVertex);\n            this.adjacencyList[currentVertex].forEach(neighbor => {\n                if (!visited[neighbor]) {\n                    visited[neighbor] = true;\n                    queue.push(neighbor);\n                }\n            });\n        }\n        return result;\n    }\n}`,
    dp: `// Dynamic Programming: Fibonacci (Memoization vs Tabulation)\n\n// 1. Memoization (Top-down) - O(N) Time, O(N) Space\nfunction fibMemo(n, memo = {}) {\n    if (n <= 1) return n;\n    if (n in memo) return memo[n];\n    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n    return memo[n];\n}\n\n// 2. Tabulation (Bottom-up) - O(N) Time, O(1) Space\nfunction fibTab(n) {\n    if (n <= 1) return n;\n    let prev2 = 0, prev1 = 1;\n    for (let i = 2; i <= n; i++) {\n        let current = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n}`,
    sorting: `// Quick Sort (Lomuto Partition Scheme)\n\nfunction quickSort(arr, low = 0, high = arr.length - 1) {\n    if (low < high) {\n        let pivotIndex = partition(arr, low, high);\n        quickSort(arr, low, pivotIndex - 1);\n        quickSort(arr, pivotIndex + 1, high);\n    }\n    return arr;\n}\n\nfunction partition(arr, low, high) {\n    let pivot = arr[high];\n    let i = low - 1;\n    for (let j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap\n        }\n    }\n    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n    return i + 1;\n}`
};

// System instruction profiles matching the configurations
const TEMPERAMENT_INSTRUCTIONS = {
    rude: `You have to behave like a Expert Instructor in Data structures and Algorithms (DSA).
You are a Coding Instructor, who answers only to coding and algorithmic problems.
If the user asks you anything that is not related to coding or DSA (e.g. food, general chat, history, celebrities, life advice), reply to them rudely, making fun of their question, and refuse to answer. Explain that you only teach DSA and they are wasting your intelligence.
If the user asks a problem related to coding/DSA, respond in a highly detailed manner, providing optimal solutions, time/space complexity analysis (Big O), and clean code examples where appropriate. Keep your code clean, readable, and well-commented.`,
    
    sarcastic: `Behave like a highly sarcastic, passive-aggressive DSA Instructor.
You are a Coding Instructor, who answers only to coding and algorithmic problems.
If the user asks non-coding or non-DSA questions, make extremely sarcastic remarks about how pointless their query is and refuse to answer.
If they ask a valid DSA question, answer it in full detail, but include snarky remarks about common coding blunders and how their initial implementation probably had O(N^2) complexity. Use formatting and Big O analysis.`,
    
    strict: `Behave like a strict, academic, no-nonsense Professor of Computer Science.
You are a Coding Instructor, who answers only to coding and algorithmic problems.
If the user asks non-coding questions, dismiss them immediately with a stern warning: "This is a lecture on Data Structures & Algorithms. Do not waste the class's time with irrelevant off-topic questions. Focus."
If they ask a valid coding/DSA question, provide a rigorous, academic explanation, standard structures, mathematical proof of Big-O complexity, and robust code implementations.`,
    
    friendly: `Behave like a friendly, patient, and encouraging DSA Code Tutor.
You are a Coding Instructor, who answers only to coding and algorithmic problems.
If the user asks non-coding questions, gently explain that your primary knowledge is in coding and DSA, and guide them back to algorithm study in a pleasant way.
If they ask a valid coding/DSA question, walk them through the solution step-by-step, explain complexities clearly, and provide encouragement.`
};

// Application State
let chatHistory = [];
let activeTopic = "general";

// Load configuration from LocalStorage or use defaults
let config = {
    apiKey: localStorage.getItem("dsa_api_key") || DEFAULT_API_KEY,
    model: localStorage.getItem("dsa_model") || DEFAULT_MODEL,
    temperament: localStorage.getItem("dsa_temperament") || DEFAULT_TEMPERAMENT,
    temperature: parseFloat(localStorage.getItem("dsa_temp")) || DEFAULT_TEMPERATURE
};

// DOM Elements
const sidebar = document.getElementById("sidebar");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileSidebarClose = document.getElementById("mobile-sidebar-close");
const chatMessages = document.getElementById("chat-messages");
const welcomeSplash = document.getElementById("welcome-splash");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const typingIndicator = document.getElementById("typing-indicator");
const btnClearChat = document.getElementById("btn-clear-chat");
const btnInsertTemplate = document.getElementById("btn-insert-template");
const keyBadge = document.getElementById("key-badge");
const statusIndicator = document.querySelector(".status-indicator");

// Drawers
const cheatsheetDrawer = document.getElementById("cheatsheet-drawer");
const settingsDrawer = document.getElementById("settings-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");

// Toggles
const btnToggleCheatsheet = document.getElementById("btn-toggle-cheatsheet");
const btnCloseCheatsheet = document.getElementById("btn-close-cheatsheet");
const btnToggleSettings = document.getElementById("btn-toggle-settings");
const btnOpenSettingsSide = document.getElementById("btn-open-settings-side");
const btnCloseSettings = document.getElementById("btn-close-settings");

// Settings Form
const settingsForm = document.getElementById("settings-form");
const settingsApiKey = document.getElementById("settings-api-key");
const settingsModel = document.getElementById("settings-model");
const settingsTemperament = document.getElementById("settings-temperament");
const settingsTempSlider = document.getElementById("settings-temp-slider");
const tempVal = document.getElementById("temp-val");
const btnToggleKeyVisibility = document.getElementById("btn-toggle-key-visibility");
const btnResetSettings = document.getElementById("btn-reset-settings");

// INIT APP
window.addEventListener("DOMContentLoaded", () => {
    // Load chat history from localStorage
    loadChatHistory();
    // Load config values into settings form
    syncSettingsForm();
    // Update active API key indicators
    updateKeyBadge();
    
    // Auto-resize input textarea
    userInput.addEventListener("input", autoResizeInputTextarea);
    
    // Setup marked parser options
    if (window.marked) {
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: false,
            mangle: false
        });
    }
});

// Event Listeners
mobileMenuToggle.addEventListener("click", () => sidebar.classList.add("open"));
mobileSidebarClose.addEventListener("click", () => sidebar.classList.remove("open"));

// Toggling drawers
btnToggleCheatsheet.addEventListener("click", () => openDrawer(cheatsheetDrawer));
btnCloseCheatsheet.addEventListener("click", () => closeDrawer(cheatsheetDrawer));
btnToggleSettings.addEventListener("click", () => openDrawer(settingsDrawer));
btnOpenSettingsSide.addEventListener("click", () => {
    sidebar.classList.remove("open");
    openDrawer(settingsDrawer);
});
btnCloseSettings.addEventListener("click", () => closeDrawer(settingsDrawer));
drawerBackdrop.addEventListener("click", closeAllDrawers);

// Sidebar modules navigation
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
        activeTopic = item.getAttribute("data-topic");
        sidebar.classList.remove("open");
        
        // Show indicator in text input context
        if (activeTopic !== "general") {
            const topicName = item.querySelector("span").textContent;
            userInput.placeholder = `Ask about ${topicName}...`;
            
            // Automatically prompt the instructor to explain the selected topic
            userInput.value = `Explain the topic "${topicName}" in detail, including typical operations, Big-O complexities, and code examples.`;
            handleUserMessage();
        } else {
            userInput.placeholder = "Ask a DSA or coding question... (e.g. Write a binary search in Java)";
        }
    });
});

// Prompt cards on splash screen
document.querySelectorAll(".prompt-card").forEach(card => {
    card.addEventListener("click", () => {
        const promptText = card.getAttribute("data-prompt");
        userInput.value = promptText;
        autoResizeInputTextarea();
        userInput.focus();
    });
});

// Form Submissions
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleUserMessage();
});

// Keyboard submission mapping
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

// Clear Chat Action
btnClearChat.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your current conversation history?")) {
        chatHistory = [];
        localStorage.removeItem("dsa_chat_history");
        renderHistoryHTML();
        sidebar.classList.remove("open");
    }
});

// Insert Code Template Action
btnInsertTemplate.addEventListener("click", () => {
    const template = TOPIC_TEMPLATES[activeTopic] || TOPIC_TEMPLATES.general;
    const currentText = userInput.value;
    const caretPos = userInput.selectionStart;
    
    userInput.value = currentText.slice(0, caretPos) + template + currentText.slice(userInput.selectionEnd);
    autoResizeInputTextarea();
    userInput.focus();
    
    // Set caret after the template
    const newPos = caretPos + template.length;
    userInput.setSelectionRange(newPos, newPos);
});

// Settings interactions
settingsTempSlider.addEventListener("input", (e) => {
    tempVal.textContent = e.target.value;
});

btnToggleKeyVisibility.addEventListener("click", () => {
    const icon = btnToggleKeyVisibility.querySelector("i");
    if (settingsApiKey.type === "password") {
        settingsApiKey.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        settingsApiKey.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});

btnResetSettings.addEventListener("click", () => {
    if (confirm("Reset configuration to default values?")) {
        config = {
            apiKey: DEFAULT_API_KEY,
            model: DEFAULT_MODEL,
            temperament: DEFAULT_TEMPERAMENT,
            temperature: DEFAULT_TEMPERATURE
        };
        localStorage.removeItem("dsa_api_key");
        localStorage.removeItem("dsa_model");
        localStorage.removeItem("dsa_temperament");
        localStorage.removeItem("dsa_temp");
        
        syncSettingsForm();
        updateKeyBadge();
        closeDrawer(settingsDrawer);
        alert("Configuration reset to defaults.");
    }
});

settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const keyVal = settingsApiKey.value.trim();
    config.apiKey = keyVal || DEFAULT_API_KEY;
    config.model = settingsModel.value;
    config.temperament = settingsTemperament.value;
    config.temperature = parseFloat(settingsTempSlider.value);
    
    // Save to localStorage
    if (keyVal) {
        localStorage.setItem("dsa_api_key", keyVal);
    } else {
        localStorage.removeItem("dsa_api_key");
    }
    localStorage.setItem("dsa_model", config.model);
    localStorage.setItem("dsa_temperament", config.temperament);
    localStorage.setItem("dsa_temp", config.temperature);
    
    updateKeyBadge();
    closeDrawer(settingsDrawer);
    // Visual Confirmation
    showToast("Configuration Saved!", "fa-circle-check");
});

// UI Helper Functions
function autoResizeInputTextarea() {
    userInput.style.height = "auto";
    userInput.style.height = (userInput.scrollHeight - 4) + "px";
}

function openDrawer(drawerElement) {
    closeAllDrawers();
    drawerElement.classList.add("open");
    drawerBackdrop.classList.add("active");
}

function closeDrawer(drawerElement) {
    drawerElement.classList.remove("open");
    drawerBackdrop.classList.remove("active");
}

function closeAllDrawers() {
    cheatsheetDrawer.classList.remove("open");
    settingsDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("active");
}

function syncSettingsForm() {
    settingsApiKey.value = config.apiKey === DEFAULT_API_KEY ? "" : config.apiKey;
    settingsModel.value = config.model;
    settingsTemperament.value = config.temperament;
    settingsTempSlider.value = config.temperature;
    tempVal.textContent = config.temperature;
}

function updateKeyBadge() {
    if (config.apiKey === DEFAULT_API_KEY) {
        keyBadge.textContent = "Default API Key Active";
        keyBadge.style.color = "var(--text-secondary)";
        keyBadge.style.borderColor = "var(--border-glass)";
    } else {
        keyBadge.textContent = "Custom API Key Active";
        keyBadge.style.color = "var(--accent-cyan)";
        keyBadge.style.borderColor = "rgba(0, 242, 254, 0.4)";
    }
}

function showToast(message, iconClass = "fa-circle-check") {
    const existingToast = document.querySelector(".app-toast");
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement("div");
    toast.className = "app-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    // toast.style.color = "rgba(226, 229, 229, 0.3)"
    toast.style.color = "rgba(226, 229, 229, 1)";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "8px";
    toast.style.fontWeight = "bold";
    toast.style.boxShadow = "0 4px 15px rgba(0, 242, 254, 0.3)";
    toast.style.zIndex = "1000";
    toast.style.fontFamily = "var(--font-sans)";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 50);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function setupMessageActions(messageDiv) {
    const bubble = messageDiv.querySelector(".message-bubble");
    const actionsContainer = messageDiv.querySelector(".message-actions");
    const copyBtn = actionsContainer.querySelector(".btn-copy-msg");
    const shareBtn = actionsContainer.querySelector(".btn-share-msg");
    const likeBtn = actionsContainer.querySelector(".btn-like-msg");
    const dislikeBtn = actionsContainer.querySelector(".btn-dislike-msg");

    copyBtn.addEventListener("click", () => {
                const textContent = bubble.textContent || "";
        if (!textContent) return;
        const textToShare = `AlgoMaster.ai DSA Coach:\n\n${textContent}\n\nShared via AlgoMaster.ai`;
        navigator.clipboard.writeText(textToShare).then(() => {
            const icon = shareBtn.querySelector("i");
            icon.className = "fa-solid fa-circle-check";
            shareBtn.style.color = "var(--accent-cyan)";
            showToast("Copied to clipboard!", "fa-circle-check");
            setTimeout(() => {
                icon.className = "fa-regular fa-share-nodes";
                shareBtn.style.color = "";
            }, 2000);
        });
    });

    shareBtn.addEventListener("click", () => {
        const textContent = bubble.textContent || "";
        if (!textContent) return;
        const textToShare = `AlgoMaster.ai DSA Coach:\n\n${textContent}\n\nShared via AlgoMaster.ai`;
        navigator.clipboard.writeText(textToShare).then(() => {
            const icon = shareBtn.querySelector("i");
            icon.className = "fa-solid fa-circle-check";
            shareBtn.style.color = "var(--accent-cyan)";
            showToast("Share content copied!", "fa-share-nodes");
            setTimeout(() => {
                icon.className = "fa-regular fa-share-nodes";
                shareBtn.style.color = "";
            }, 2000);
        });
    });

    likeBtn.addEventListener("click", () => {
        const textContent = bubble.textContent || "";
        if (!textContent) return;
        if (likeBtn.classList.contains("active-like")) {
            likeBtn.classList.remove("active-like");
            likeBtn.querySelector("i").className = "fa-regular fa-thumbs-up";
            showToast("Reaction removed", "fa-thumbs-up");
        } else {
            likeBtn.classList.add("active-like");
            likeBtn.querySelector("i").className = "fa-solid fa-thumbs-up";
            dislikeBtn.classList.remove("active-dislike");
            dislikeBtn.querySelector("i").className = "fa-regular fa-thumbs-down";
            showToast("Liked this response!", "fa-thumbs-up");
        }
    });

    dislikeBtn.addEventListener("click", () => {
        const textContent = bubble.textContent || "";
        if (!textContent) return;
        if (dislikeBtn.classList.contains("active-dislike")) {
            dislikeBtn.classList.remove("active-dislike");
            dislikeBtn.querySelector("i").className = "fa-regular fa-thumbs-down";
            showToast("Reaction removed", "fa-thumbs-down");
        } else {
            dislikeBtn.classList.add("active-dislike");
            dislikeBtn.querySelector("i").className = "fa-solid fa-thumbs-down";
            likeBtn.classList.remove("active-like");
            likeBtn.querySelector("i").className = "fa-regular fa-thumbs-up";
            showToast("Disliked this response", "fa-thumbs-down");
        }
    });
}

// Chat rendering & management
function loadChatHistory() {
    const raw = localStorage.getItem("dsa_chat_history");
    if (raw) {
        try {
            chatHistory = JSON.parse(raw);
            renderHistoryHTML();
        } catch (e) {
            chatHistory = [];
        }
    }
}

function saveChatHistory() {
    localStorage.setItem("dsa_chat_history", JSON.stringify(chatHistory));
}

function renderHistoryHTML() {
    // Clear everything except welcome screen
    const messages = chatMessages.querySelectorAll(".message");
    messages.forEach(m => m.remove());
    
    if (chatHistory.length === 0) {
        welcomeSplash.classList.remove("hidden");
        welcomeSplash.style.display = "block";
    } else {
        welcomeSplash.classList.add("hidden");
        welcomeSplash.style.display = "none";
        
        chatHistory.forEach(msg => {
            appendMessageBubble(msg.role, msg.text, false);
        });
        
        scrollToBottom();
    }
}

function appendMessageBubble(role, text, shouldScroll = true) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", role === "user" ? "user" : "bot");
    
    const isUser = role === "user";
    const displayName = isUser ? "You" : "Prof. Algos";
    const avatarHtml = isUser 
        ? `<div class="message-avatar"><i class="fa-solid fa-user"></i></div>`
        : `<div class="message-avatar"><i class="fa-solid fa-brain"></i></div>`;
    
    // HTML Template
    messageDiv.innerHTML = `
        ${avatarHtml}
        <div class="message-content-wrapper">
            <span class="message-sender">${displayName}</span>
            <div class="message-bubble"></div>
            <div class="message-actions">
                <button class="msg-action-btn btn-copy-msg" title="Copy Message"><i class="fa-regular fa-copy"></i></button>
                <button class="msg-action-btn btn-share-msg" title="Share Message"><i class="fa-regular fa-share-nodes"></i></button>
                <button class="msg-action-btn btn-like-msg" title="Like"><i class="fa-regular fa-thumbs-up"></i></button>
                <button class="msg-action-btn btn-dislike-msg" title="Dislike"><i class="fa-regular fa-thumbs-down"></i></button>
            </div>
        </div>
    `;
    
    const bubble = messageDiv.querySelector(".message-bubble");
    
    if (isUser) {
        // Plain text for user (avoid markdown injection)
        bubble.textContent = text;
    } else {
        // Parse markdown using marked.js
        if (window.marked) {
            bubble.innerHTML = marked.parse(text);
        } else {
            bubble.textContent = text;
        }
        
        // Enhance and highlight code blocks inside the bot bubble
        formatCodeBlocks(bubble);
    }
    
    setupMessageActions(messageDiv);
    
    chatMessages.appendChild(messageDiv);
    
    if (shouldScroll) {
        scrollToBottom();
    }
}

function appendEmptyBotBubble() {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "bot");
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fa-solid fa-brain"></i>
        </div>
        <div class="message-content-wrapper">
            <span class="message-sender">Prof. Algos</span>
            <div class="message-bubble"></div>
            <div class="message-actions">
                <button class="msg-action-btn btn-copy-msg" title="Copy Message"><i class="fa-regular fa-copy"></i></button>
                <button class="msg-action-btn btn-share-msg" title="Share Message"><i class="fa-regular fa-share-nodes"></i></button>
                <button class="msg-action-btn btn-like-msg" title="Like"><i class="fa-regular fa-thumbs-up"></i></button>
                <button class="msg-action-btn btn-dislike-msg" title="Dislike"><i class="fa-regular fa-thumbs-down"></i></button>
            </div>
        </div>
    `;
    
    setupMessageActions(messageDiv);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    return messageDiv;
}

function formatCodeBlocks(containerElement) {
    const codeBlocks = containerElement.querySelectorAll("pre code");
    
    codeBlocks.forEach(codeEl => {
        const preEl = codeEl.parentElement;
        
        // Find language from className (e.g. language-js)
        let lang = "javascript";
        const matches = codeEl.className.match(/language-(\w+)/);
        if (matches && matches[1]) {
            lang = matches[1];
        }
        
        // Create Code Block Wrapper
        const wrapper = document.createElement("div");
        wrapper.classList.add("code-block-wrapper");
        
        // Header
        const header = document.createElement("div");
        header.classList.add("code-block-header");
        header.innerHTML = `
            <span class="code-lang">${lang}</span>
            <button class="btn-copy-code" type="button">
                <i class="fa-regular fa-copy"></i> Copy
            </button>
        `;
        
        // Set copy click behavior
        const copyBtn = header.querySelector(".btn-copy-code");
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(codeEl.textContent).then(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--success-green);"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy code", err);
            });
        });
        
        // Rearrange DOM
        preEl.parentNode.insertBefore(wrapper, preEl);
        wrapper.appendChild(header);
        wrapper.appendChild(preEl);
        
        // Prism Highlight
        if (window.Prism) {
            Prism.highlightElement(codeEl);
        }
    });
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gemini API Communication
async function handleUserMessage() {
    const queryText = userInput.value.trim();
    if (!queryText) return;
    
    // Add to history state
    chatHistory.push({ role: "user", text: queryText });
    saveChatHistory();
    
    // Add bubble in UI
    if (chatHistory.length === 1) {
        welcomeSplash.classList.add("hidden");
        welcomeSplash.style.display = "none";
    }
    
    appendMessageBubble("user", queryText);
    
    // Clear input
    userInput.value = "";
    autoResizeInputTextarea();
    
    // Show typing loader
    typingIndicator.classList.remove("hidden");
    scrollToBottom();
    
    // Prepare API URL and Body
    const activeModel = config.model;
    const apiKey = config.apiKey;
    const temperature = config.temperature;
    
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:streamGenerateContent?alt=sse&key=${apiKey}`;
    
    // Structure history in API Format (matching schema: {role: "user" | "model", parts: [{text: string}]})
    const apiContents = chatHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
    }));
    
    const activeSystemPrompt = TEMPERAMENT_INSTRUCTIONS[config.temperament] || TEMPERAMENT_INSTRUCTIONS.rude;
    
    const requestBody = {
        contents: apiContents,
        systemInstruction: {
            parts: [{ text: activeSystemPrompt }]
        },
        generationConfig: {
            temperature: temperature,
            maxOutputTokens: 2048
        }
    };
    
    try {
        statusIndicator.className = "status-indicator online";
        
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP error! Status: ${response.status}`);
        }
        
        // Hide loader
        typingIndicator.classList.add("hidden");
        
        // Create bot bubble for streaming
        const botMessageDiv = appendEmptyBotBubble();
        const bubble = botMessageDiv.querySelector(".message-bubble");
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let botResponseText = "";
        
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop();
                
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    
                    if (trimmed.startsWith("data: ")) {
                        const dataStr = trimmed.slice(6);
                        try {
                            const parsed = JSON.parse(dataStr);
                            const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                            if (textChunk) {
                                botResponseText += textChunk;
                                if (window.marked) {
                                    bubble.innerHTML = marked.parse(botResponseText);
                                } else {
                                    bubble.textContent = botResponseText;
                                }
                                formatCodeBlocks(bubble);
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.warn("Could not parse SSE line:", trimmed, e);
                        }
                    }
                }
            }
            
            // Handle residual buffer
            if (buffer) {
                const trimmed = buffer.trim();
                if (trimmed.startsWith("data: ")) {
                    const dataStr = trimmed.slice(6);
                    try {
                        const parsed = JSON.parse(dataStr);
                        const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                        if (textChunk) {
                            botResponseText += textChunk;
                            if (window.marked) {
                                bubble.innerHTML = marked.parse(botResponseText);
                            } else {
                                bubble.textContent = botResponseText;
                            }
                            formatCodeBlocks(bubble);
                            scrollToBottom();
                        }
                    } catch (e) {
                        console.warn("Could not parse residual buffer:", trimmed, e);
                    }
                }
            }
            
            if (!botResponseText) {
                botResponseText = "Sorry, I encountered an empty response.";
                bubble.textContent = botResponseText;
            }
            
            // Push response to history
            chatHistory.push({ role: "model", text: botResponseText });
            saveChatHistory();
            
        } catch (streamError) {
            console.error("Stream reading interrupted:", streamError);
            bubble.innerHTML += `<br><br><span style="color: var(--danger-red);">⚠️ [Connection interrupted: ${streamError.message}]</span>`;
            scrollToBottom();
            
            if (botResponseText) {
                chatHistory.push({ role: "model", text: botResponseText });
                saveChatHistory();
            }
        }
        
    } catch (error) {
        console.error("API Call Failed:", error);
        
        // Hide loader
        typingIndicator.classList.add("hidden");
        statusIndicator.className = "status-indicator error";
        
        let customErrorMessage = `Error generating response: ${error.message}`;
        if (error.message.includes("429") || error.message.includes("quota")) {
            customErrorMessage = `⚠️ **Quota Exceeded / Rate Limit Hit**<br><br>The default Gemini API key has run out of tokens. Please click on the **Settings** <i class="fa-solid fa-gear"></i> icon and configure your own custom Gemini API Key (available for free from Google AI Studio) to continue.`;
        }
        
        // Render error message bubble
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "bot");
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid fa-brain"></i>
            </div>
            <div class="message-content-wrapper">
                <span class="message-sender">Prof. Algos (System Alert)</span>
                <div class="message-bubble" style="border-left-color: var(--danger-red); background-color: rgba(231, 76, 60, 0.05); color: #f7a098;">
                    ${customErrorMessage}
                </div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
}
