function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function blockButton(block) {
  if (!block.buttonLabel || !block.buttonHref) return "";
  return '<a class="builder-btn" href="' + escapeHtml(block.buttonHref) + '">' + escapeHtml(block.buttonLabel) + "</a>";
}

function renderItems(items) {
  if (!Array.isArray(items) || !items.length) return "";
  return '<ul class="builder-list">' + items.map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>";
}

function renderPairs(items, className) {
  if (!Array.isArray(items) || !items.length) return "";
  return '<div class="' + className + '">' + items.map((item) =>
    '<article><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.text) + "</p></article>"
  ).join("") + "</div>";
}

function renderBlock(block, index) {
  const kicker = block.kicker ? '<p class="builder-kicker">' + escapeHtml(block.kicker) + "</p>" : "";
  const title = block.title ? "<h2>" + escapeHtml(block.title) + "</h2>" : "";
  const text = block.text ? "<p>" + escapeHtml(block.text) + "</p>" : "";

  if (block.type === "hero") {
    return '<section class="builder-hero">' + kicker + (block.title ? "<h1>" + escapeHtml(block.title) + "</h1>" : "") + text + renderItems(block.items) + blockButton(block) + "</section>";
  }

  if (block.type === "cards") {
    return '<section class="builder-section">' + kicker + title + text + renderPairs(block.items, "builder-cards") + blockButton(block) + "</section>";
  }

  if (block.type === "faq") {
    return '<section class="builder-section">' + kicker + title + text + renderPairs(block.items, "builder-faq") + "</section>";
  }

  if (block.type === "cta") {
    return '<section class="builder-cta">' + kicker + title + text + blockButton(block) + "</section>";
  }

  return '<section class="builder-section">' + kicker + title + text + renderItems(block.items) + blockButton(block) + "</section>";
}

function renderBuilderPage(page) {
  const title = escapeHtml(page.title || "Cobrait");
  const description = escapeHtml(page.description || "COBRAIT Software Factory");
  const blocks = (page.blocks || []).map(renderBlock).join("");

  return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Cobrait</title>
  <meta name="description" content="${description}">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon/favicon-16x16.png">
  <style>
    :root{color-scheme:dark;--bg:#07091a;--surface:#0e1230;--line:rgba(255,255,255,.1);--text:#f8fafc;--muted:#aab3d2;--primary:#8b5cf6;--blue:#315cff}
    *{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 15% 10%,rgba(139,92,246,.28),transparent 34%),radial-gradient(circle at 86% 18%,rgba(49,92,255,.22),transparent 36%),var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6}
    body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:64px 64px}
    a{color:inherit}.builder-shell{position:relative;z-index:1;min-height:100vh}.builder-header,.builder-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;width:min(1440px,calc(100% - 48px));margin:0 auto;padding:24px 0}.builder-header{position:sticky;top:0;z-index:10;backdrop-filter:blur(18px)}.builder-logo{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:900}.builder-logo img{height:48px;width:auto;filter:brightness(0) invert(1)}.builder-nav{display:flex;gap:18px;color:var(--muted);font-size:14px}.builder-nav a{text-decoration:none}.builder-nav a:hover{color:var(--text)}
    main{width:min(1440px,calc(100% - 48px));margin:0 auto}.builder-hero{padding:108px 0 84px;max-width:920px}.builder-kicker{margin:0 0 18px;color:#b999ff;text-transform:uppercase;letter-spacing:.24em;font-size:12px;font-weight:800}.builder-hero h1{margin:0;font-size:clamp(48px,8vw,116px);line-height:.94;letter-spacing:-.07em}.builder-hero>p,.builder-section>p,.builder-cta>p{max-width:760px;color:var(--muted);font-size:clamp(18px,2vw,24px)}
    .builder-section{padding:72px 0;border-top:1px solid var(--line)}.builder-section h2,.builder-cta h2{margin:0 0 16px;font-size:clamp(34px,5vw,64px);line-height:1;letter-spacing:-.05em}.builder-list{display:grid;gap:12px;max-width:760px;margin:28px 0 0;padding:0;list-style:none}.builder-list li{padding:14px 18px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.04);color:#dbe2ff}
    .builder-cards,.builder-faq{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:34px}.builder-cards article,.builder-faq article{border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.045);padding:26px}.builder-cards h3,.builder-faq h3{margin:0 0 10px;font-size:22px;line-height:1.12}.builder-cards p,.builder-faq p{margin:0;color:var(--muted)}
    .builder-cta{margin:72px 0;padding:54px;border:1px solid rgba(139,92,246,.34);border-radius:32px;background:linear-gradient(135deg,rgba(139,92,246,.28),rgba(49,92,255,.18));text-align:center}.builder-cta p{margin-left:auto;margin-right:auto}.builder-btn{display:inline-flex;margin-top:26px;align-items:center;justify-content:center;padding:15px 24px;border-radius:999px;background:linear-gradient(135deg,var(--primary),var(--blue));text-decoration:none;font-weight:800;box-shadow:0 18px 48px rgba(91,80,255,.28)}
    .builder-footer{border-top:1px solid var(--line);color:var(--muted);font-size:14px}
    @media(max-width:800px){.builder-header,.builder-footer,main{width:min(100% - 32px,720px)}.builder-nav{display:none}.builder-hero{padding:72px 0 56px}.builder-cards,.builder-faq{grid-template-columns:1fr}.builder-cta{padding:34px 22px}}
  </style>
</head>
<body>
  <div class="builder-shell">
    <header class="builder-header">
      <a class="builder-logo" href="/"><img src="/assets/logo-mark-cropped-CVmwixhD.png" alt="Cobrait"><span>COBRAIT</span></a>
      <nav class="builder-nav"><a href="/">Início</a><a href="/servicos">Serviços</a><a href="/about-us.html">Sobre nós</a><a href="/book-a-call.html">Agendar chamada</a></nav>
    </header>
    <main>${blocks}</main>
    <footer class="builder-footer"><span>© 2026 Cobrait — Software Factory</span><a href="mailto:geral@cobrait.pt">geral@cobrait.pt</a></footer>
  </div>
</body>
</html>`;
}

module.exports = {
  renderBuilderPage
};
