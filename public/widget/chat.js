(function () {
  var CONFIG = window.__AGENCY_CHAT_CONFIG__ || {};
  var COLOR = CONFIG.color || "#3d6b35";
  var WEBHOOK = CONFIG.webhook || "";
  var PLACEHOLDER = CONFIG.placeholder || "How can we help you?";
  var GREETING = CONFIG.greeting || "Hi! How can we help you today?";
  var AUTO_REPLY_FAQ = CONFIG.autoReplyFaq || "Thanks for your message! We'll get back to you shortly.";
  var REPLY_HUMAN = CONFIG.replyHuman || "Thanks for reaching out. A member of our team will get back to you as soon as possible.";

  // Inject styles
  var style = document.createElement("style");
  style.textContent = [
    "#agency-chat-bubble{position:fixed;bottom:24px;right:24px;z-index:9999;width:56px;height:56px;border-radius:50%;background:" + COLOR + ";cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.18);transition:transform .2s;}",
    "#agency-chat-bubble:hover{transform:scale(1.08);}",
    "#agency-chat-bubble svg{width:26px;height:26px;fill:white;}",
    "#agency-chat-panel{position:fixed;bottom:92px;right:24px;z-index:9999;width:340px;max-width:calc(100vw - 48px);background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.14);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    "#agency-chat-panel.open{display:flex;}",
    "#agency-chat-header{background:" + COLOR + ";padding:16px 18px;color:white;}",
    "#agency-chat-header h3{margin:0;font-size:15px;font-weight:600;}",
    "#agency-chat-header p{margin:4px 0 0;font-size:12px;opacity:.85;}",
    "#agency-chat-messages{flex:1;padding:16px;overflow-y:auto;max-height:260px;display:flex;flex-direction:column;gap:10px;}",
    ".agency-msg{max-width:85%;padding:10px 13px;border-radius:12px;font-size:13px;line-height:1.5;}",
    ".agency-msg.bot{background:#f3f4f6;color:#1f2937;align-self:flex-start;border-bottom-left-radius:4px;}",
    ".agency-msg.user{background:" + COLOR + ";color:white;align-self:flex-end;border-bottom-right-radius:4px;}",
    ".agency-msg.typing{color:#9ca3af;font-style:italic;}",
    "#agency-chat-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #f0f0f0;}",
    "#agency-chat-input{flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:9px 12px;font-size:13px;outline:none;resize:none;font-family:inherit;}",
    "#agency-chat-input:focus{border-color:" + COLOR + ";}",
    "#agency-chat-send{background:" + COLOR + ";color:white;border:none;border-radius:8px;padding:0 14px;cursor:pointer;font-size:13px;font-weight:600;transition:opacity .15s;}",
    "#agency-chat-send:hover{opacity:.88;}",
    "#agency-chat-send:disabled{opacity:.45;cursor:default;}",
  ].join("");
  document.head.appendChild(style);

  // Bubble
  var bubble = document.createElement("div");
  bubble.id = "agency-chat-bubble";
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
  document.body.appendChild(bubble);

  // Panel
  var panel = document.createElement("div");
  panel.id = "agency-chat-panel";
  panel.innerHTML = [
    '<div id="agency-chat-header">',
    '  <h3>' + (CONFIG.brandName || "Support") + '</h3>',
    '  <p>Typically replies instantly</p>',
    '</div>',
    '<div id="agency-chat-messages"></div>',
    '<div id="agency-chat-input-row">',
    '  <textarea id="agency-chat-input" rows="1" placeholder="' + PLACEHOLDER + '"></textarea>',
    '  <button id="agency-chat-send">Send</button>',
    '</div>',
  ].join("");
  document.body.appendChild(panel);

  var messages = document.getElementById("agency-chat-messages");
  var input = document.getElementById("agency-chat-input");
  var sendBtn = document.getElementById("agency-chat-send");
  var isOpen = false;
  var hasGreeted = false;

  function addMessage(text, type) {
    var msg = document.createElement("div");
    msg.className = "agency-msg " + type;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  }

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      setTimeout(function () { addMessage(GREETING, "bot"); }, 200);
    }
    if (isOpen) setTimeout(function () { input.focus(); }, 100);
  }

  function sendMessage() {
    var text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    addMessage(text, "user");
    input.value = "";
    sendBtn.disabled = true;

    var typing = addMessage("...", "bot typing");

    if (!WEBHOOK) {
      setTimeout(function () {
        typing.remove();
        addMessage(REPLY_HUMAN, "bot");
        sendBtn.disabled = false;
      }, 1000);
      return;
    }

    fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        source: "chat_widget",
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        typing.remove();
        var reply = (data && data.auto_reply) ? data.auto_reply : REPLY_HUMAN;
        addMessage(reply, "bot");
        sendBtn.disabled = false;
      })
      .catch(function () {
        typing.remove();
        addMessage(REPLY_HUMAN, "bot");
        sendBtn.disabled = false;
      });
  }

  bubble.addEventListener("click", togglePanel);
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
