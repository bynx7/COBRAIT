(function () {
  function apiBase() {
    var saved = "";
    try {
      saved = localStorage.getItem("cobrait_admin_api_base") || "";
    } catch (_error) {}

    if (saved) return saved.replace(/\/+$/, "");
    if (window.location.protocol === "file:") return "http://localhost:4000/api";

    var hostname = String(window.location.hostname || "").toLowerCase();
    if ((hostname === "localhost" || hostname === "127.0.0.1") && window.location.port !== "4000") {
      return window.location.protocol + "//" + hostname + ":4000/api";
    }

    return window.location.origin.replace(/\/+$/, "") + "/api";
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function fieldValue(control) {
    if (!control) return "";
    if (control.type === "checkbox") return control.checked ? "Sim" : "";
    return String(control.value || "").trim();
  }

  function setFieldNames(form) {
    var textInputs = form.querySelectorAll('input[type="text"]');
    var emailInput = form.querySelector('input[type="email"]');
    var textarea = form.querySelector("textarea");
    var checkbox = form.querySelector('input[type="checkbox"]');
    var budgetOptions = form.querySelectorAll('input[type="radio"][name="budget"]');

    if (textInputs[0]) textInputs[0].name = "fullName";
    if (emailInput) emailInput.name = "email";
    if (textarea) {
      textarea.name = "projectSummary";
      textarea.required = true;
    }
    if (textInputs[1]) textInputs[1].name = "sourceCampaign";
    if (checkbox) {
      checkbox.name = "nda";
      checkbox.value = "Sim";
    }
    Array.prototype.forEach.call(budgetOptions, function (option) {
      option.name = "budgetRange";
    });
    if (budgetOptions[0]) budgetOptions[0].required = true;
  }

  function bookingPayload(form) {
    var fullName = form.querySelector('[name="fullName"]');
    var email = form.querySelector('[name="email"]');
    var projectSummary = form.querySelector('[name="projectSummary"]');
    var budget = form.querySelector('[name="budgetRange"]:checked');
    var sourceCampaign = form.querySelector('[name="sourceCampaign"]');
    var nda = form.querySelector('[name="nda"]');

    return {
      fullName: fieldValue(fullName),
      email: fieldValue(email),
      projectSummary: [
        fieldValue(projectSummary),
        fieldValue(nda) ? "NDA requerido: Sim" : ""
      ].filter(Boolean).join("\n"),
      budgetRange: fieldValue(budget),
      sourceCampaign: fieldValue(sourceCampaign),
      serviceInterest: "Book a call",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      sourcePage: window.location.pathname || "/book-a-call.html"
    };
  }

  function successBoxFor(form) {
    var existing = document.getElementById("formSuccess");
    if (existing) return existing;

    var box = document.createElement("div");
    box.id = "formSuccess";
    box.className = "relative overflow-hidden rounded-[28px] border border-border bg-surface/40 p-8 md:p-12";
    box.style.display = "none";
    box.innerHTML = [
      '<p class="text-[10px] uppercase tracking-[0.3em] text-primary">Pedido enviado</p>',
      '<h2 class="mt-3 font-serif text-3xl leading-tight tracking-tight md:text-4xl">Pedido enviado com sucesso.</h2>',
      '<p class="mt-5 text-sm leading-relaxed text-muted-foreground">Obrigado pelo contacto. Vamos analisar e entraremos em contacto normalmente em 24-48h.</p>',
      '<p class="mt-4 text-xs text-muted-foreground">Se precisares de algo urgente, envia email para geral@cobrait.pt.</p>'
    ].join("");

    if (form.parentNode) {
      form.parentNode.insertBefore(box, form.nextSibling);
    }

    return box;
  }

  function configureForm(form) {
    form.id = form.id || "contactForm";
    form.action = apiBase() + "/call-bookings";
    form.method = "POST";
    form.autocomplete = "on";

    setFieldNames(form);
  }

  function submitWithApi(form, successBox) {
    var button = form.querySelector('button[type="submit"]');
    var originalHtml = button ? button.innerHTML : "";

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (form.reportValidity && !form.reportValidity()) return;

      if (button) {
        button.disabled = true;
        button.textContent = "A enviar...";
        button.style.opacity = "0.9";
      }

      try {
        var response = await fetch(form.action, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingPayload(form))
        });
        var data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok) {
          throw new Error(data.message || "Nao foi possivel enviar agora.");
        }

        form.reset();
        form.style.display = "none";
        if (successBox) {
          successBox.style.display = "block";
          successBox.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {
        alert("Nao foi possivel enviar agora. Tenta novamente em instantes ou envia email para geral@cobrait.pt.");
        if (button) {
          button.disabled = false;
          button.innerHTML = originalHtml || "Enviar pedido";
          button.style.opacity = "";
        }
      }
    });
  }

  onReady(function () {
    if (!/book-a-call\.html?$|agendar-chamada/i.test(window.location.pathname)) return;

    var form = document.getElementById("contactForm") || document.querySelector("main form");
    if (!form) return;

    configureForm(form);
    submitWithApi(form, successBoxFor(form));
  });
})();
