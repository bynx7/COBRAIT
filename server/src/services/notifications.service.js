const nodemailer = require("nodemailer");
const config = require("../config");

let transporter;

function isEmailEnabled() {
  return Boolean(config.smtpHost && config.smtpUser && config.smtpPassword && config.notificationEmailTo);
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword
      }
    });
  }

  return transporter;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value) {
  const text = String(value || "").trim();
  return text || "-";
}

function formatRowsForFormSubmit(rows) {
  return rows.reduce((params, row) => {
    params.append(row.label, formatValue(row.value));
    return params;
  }, new URLSearchParams());
}

function detailsText(title, rows) {
  return [
    title,
    "",
    ...rows.map((row) => row.label + ": " + formatValue(row.value))
  ].join("\n");
}

function detailsHtml(title, rows) {
  const bodyRows = rows
    .map((row) => {
      return (
        "<tr>" +
        '<td style="padding:8px 10px;border:1px solid #e5e7eb;font-weight:700;">' +
        escapeHtml(row.label) +
        "</td>" +
        '<td style="padding:8px 10px;border:1px solid #e5e7eb;white-space:pre-line;">' +
        escapeHtml(formatValue(row.value)) +
        "</td>" +
        "</tr>"
      );
    })
    .join("");

  return (
    '<div style="font-family:Arial,sans-serif;color:#111827;line-height:1.45;">' +
    '<h2 style="margin:0 0 16px;">' +
    escapeHtml(title) +
    "</h2>" +
    '<table style="border-collapse:collapse;width:100%;max-width:760px;">' +
    bodyRows +
    "</table>" +
    "</div>"
  );
}

async function sendViaFormSubmit(subject, rows) {
  const endpoint = "https://formsubmit.co/ajax/" + encodeURIComponent(config.notificationEmailTo);
  const body = formatRowsForFormSubmit(rows);
  body.append("_subject", subject);
  body.append("_captcha", "false");
  body.append("_template", "table");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error("FormSubmit notification failed with status " + response.status);
  }
}

async function sendNotification(subject, rows, replyTo) {
  if (!isEmailEnabled()) {
    await sendViaFormSubmit(subject, rows);
    return;
  }

  const title = subject;

  await getTransporter().sendMail({
    from: config.notificationEmailFrom,
    to: config.notificationEmailTo,
    replyTo: replyTo || undefined,
    subject,
    text: detailsText(title, rows),
    html: detailsHtml(title, rows)
  });
}

async function notifyCallBookingCreated(booking) {
  await sendNotification(
    "Novo pedido de chamada - COBRAIT",
    [
      { label: "Nome", value: booking.fullName },
      { label: "Email", value: booking.email },
      { label: "Telefone", value: booking.phone },
      { label: "Empresa", value: booking.company },
      { label: "Resumo do projeto", value: booking.projectSummary },
      { label: "Data preferida", value: booking.preferredDate },
      { label: "Hora preferida", value: booking.preferredTime },
      { label: "Fuso horario", value: booking.timezone },
      { label: "Orcamento", value: booking.budgetRange },
      { label: "Servico de interesse", value: booking.serviceInterest },
      { label: "Origem", value: booking.sourceCampaign },
      { label: "Pagina", value: booking.sourcePage },
      { label: "Recebido em", value: booking.createdAt },
      { label: "ID", value: booking.id }
    ],
    booking.email
  );
}

async function notifyContactRequestCreated(contactRequest) {
  await sendNotification(
    "Novo contacto via site - COBRAIT",
    [
      { label: "Nome", value: contactRequest.fullName },
      { label: "Email", value: contactRequest.email },
      { label: "Telefone", value: contactRequest.phone },
      { label: "Empresa", value: contactRequest.company },
      { label: "Assunto", value: contactRequest.subject },
      { label: "Mensagem", value: contactRequest.message },
      { label: "Origem", value: contactRequest.sourceCampaign },
      { label: "Pagina", value: contactRequest.sourcePage },
      { label: "Recebido em", value: contactRequest.createdAt },
      { label: "ID", value: contactRequest.id }
    ],
    contactRequest.email
  );
}

module.exports = {
  notifyCallBookingCreated,
  notifyContactRequestCreated
};
