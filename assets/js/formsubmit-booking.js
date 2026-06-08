(function () {
  var FORM_ACTION = "https://formsubmit.co/ajax/geral@cobrait.pt";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function ensureHidden(form, name, value) {
    var input = form.querySelector('input[type="hidden"][name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.insertBefore(input, form.firstChild);
    }

    input.value = value;
  }

  function setFieldNames(form) {
    var textInputs = form.querySelectorAll('input[type="text"]');
    var emailInput = form.querySelector('input[type="email"]');
    var textarea = form.querySelector("textarea");
    var checkbox = form.querySelector('input[type="checkbox"]');
    var budgetOptions = form.querySelectorAll('input[type="radio"][name="budget"]');

    if (textInputs[0]) textInputs[0].name = "Nome";
    if (emailInput) emailInput.name = "Email";
    if (textarea) {
      textarea.name = "description";
      textarea.required = true;
    }
    if (textInputs[1]) textInputs[1].name = "referral";
    if (checkbox) {
      checkbox.name = "nda";
      checkbox.value = "Sim";
    }
    if (budgetOptions[0]) budgetOptions[0].required = true;
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
    form.action = FORM_ACTION;
    form.method = "POST";
    form.autocomplete = "on";
    form.dataset.externalForm = "formsubmit";

    ensureHidden(form, "_template", "table");
    ensureHidden(form, "_captcha", "false");
    ensureHidden(form, "_subject", "Novo pedido - Book a Call");
    setFieldNames(form);
  }

  function submitWithFormSubmit(form, successBox) {
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
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) throw new Error("Network response was not ok");

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
    submitWithFormSubmit(form, successBoxFor(form));
  });
})();
