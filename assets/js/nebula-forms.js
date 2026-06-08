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

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function statusElement(form) {
    var existing = form.querySelector("[data-form-status]");
    if (existing) return existing;

    var status = document.createElement("p");
    status.setAttribute("data-form-status", "");
    status.className = "text-xs text-muted-foreground";
    var button = form.querySelector("button[type='submit']");
    if (button && button.parentNode) {
      button.parentNode.insertBefore(status, button.nextSibling);
    } else {
      form.appendChild(status);
    }
    return status;
  }

  function setStatus(form, state, message) {
    var status = statusElement(form);
    status.dataset.state = state || "";
    status.textContent = message || "";
  }

  function readControl(control) {
    if (!control) return "";
    if (control.type === "checkbox") return control.checked ? "Sim" : "";
    return String(control.value || "").trim();
  }

  function formValues(form) {
    var values = {};

    Array.prototype.forEach.call(form.elements, function (control) {
      if (!control || !control.tagName || control.type === "submit") return;

      if (control.name) {
        values[control.name] = readControl(control);
      }

      var label = control.closest ? control.closest("label") : null;
      var labelText = "";
      if (label) {
        var labelTitle = label.querySelector("span");
        labelText = labelTitle ? labelTitle.textContent : label.textContent;
      } else if (control.placeholder) {
        labelText = control.placeholder;
      }

      var key = normalize(labelText || control.placeholder || control.name);
      if (key) values[key] = readControl(control);
    });

    return values;
  }

  function contactPayload(form) {
    var values = formValues(form);
    var description = values.descricao || values.projectSummary || values.message || "";
    var budget = values.orcamento || values.budgetRange || "";
    var source = values["como soubeste de nos"] || "";
    var nda = values["este projeto requer nda"] || "";

    return {
      fullName: values.fullName || values.nome || "",
      email: values.email || "",
      phone: values.phone || values.telefone || "",
      company: values.company || values.empresa || "",
      subject: "Contacto via site",
      message: [
        description,
        budget ? "Orcamento: " + budget : "",
        source ? "Origem indicada: " + source : "",
        nda ? "NDA requerido: " + nda : ""
      ].filter(Boolean).join("\n"),
      sourcePage: window.location.pathname || "/"
    };
  }

  function bookingPayload(form) {
    var values = formValues(form);

    return {
      fullName: values.fullName || values.nome || "",
      email: values.email || "",
      phone: values.phone || values.telefone || "",
      company: values.company || values.empresa || "",
      projectSummary: values.projectSummary || values.descricao || values.message || "",
      preferredDate: values.preferredDate || "",
      preferredTime: values.preferredTime || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      budgetRange: values.budgetRange || values.orcamento || "",
      serviceInterest: values.serviceInterest || "",
      sourcePage: window.location.pathname || "/"
    };
  }

  function isExternalForm(form) {
    var action = String(form.getAttribute("action") || "").trim();
    if (form.dataset && form.dataset.externalForm) return true;
    return /^https?:\/\//i.test(action) && !action.includes(window.location.host);
  }

  async function submitForm(form) {
    var isBooking = form.dataset.nebulaForm === "booking";
    var endpoint = apiBase() + (isBooking ? "/call-bookings" : "/contact-requests");
    var payload = isBooking ? bookingPayload(form) : contactPayload(form);
    var button = form.querySelector("button[type='submit']");

    if (form.reportValidity && !form.reportValidity()) return;

    if (button) button.disabled = true;
    setStatus(form, "", "A enviar...");

    try {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      var data = await response.json().catch(function () {
        return {};
      });

      if (!response.ok) {
        throw new Error(data.message || "Nao foi possivel enviar o pedido.");
      }

      form.reset();
      setStatus(form, "success", "Pedido enviado. Obrigado.");
    } catch (error) {
      setStatus(form, "error", error.message || "Nao foi possivel enviar o pedido.");
    } finally {
      if (button) button.disabled = false;
    }
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.matches || !form.matches("form")) return;
    if (isExternalForm(form)) return;

    event.preventDefault();
    submitForm(form);
  });
})();
