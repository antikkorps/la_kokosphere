const nodemailer = require("nodemailer")

const SPAM_KEYWORDS = [
  "viagra",
  "casino",
  "bitcoin",
  "crypto",
  "loan",
  "sex",
  "escort",
  "porn",
  "http",
  "https",
  "url=",
  "href=",
]

function sanitize(str) {
  if (!str) return ""
  return String(str)
    .replace(/<[^>]*>?/gm, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim()
}

function containsSpam(str) {
  if (!str) return false
  const lower = str.toLowerCase()
  return SPAM_KEYWORDS.some((word) => lower.includes(word))
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" }
  }

  const data = JSON.parse(event.body)

  // 1. Vérification du honeypot
  if (data.website && data.website.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Merci !" }),
    }
  }

  // 2. Sanitize tous les champs
  const firstname = sanitize(data.firstname)
  const lastname = sanitize(data.lastname)
  const email = sanitize(data.email)
  const phone = sanitize(data.phone)
  const subject = sanitize(data.subject)
  const message = sanitize(data.message)

  // 3. Filtre anti-spam par mots-clés
  const allFields = [firstname, lastname, email, phone, subject, message].join(" ")
  if (containsSpam(allFields)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Merci !" }),
    }
  }

  // 4. Vérification email basique
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Email invalide" }),
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fafbfc;border-radius:12px;border:1px solid #e5e7eb;">
      <h2 style="color:#2563eb;margin-bottom:8px;">Nouveau message de contact</h2>
      <p style="margin-bottom:16px;">Vous avez reçu un message via le formulaire de contact du site <strong>La Kokosphere</strong> :</p>
      <table style="width:100%;margin-bottom:24px;">
        <tr><td style="font-weight:bold;padding:4px 0;">Prénom :</td><td>${firstname}</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Nom :</td><td>${lastname}</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Email :</td><td>${email}</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Téléphone :</td><td>${
          phone || "Non renseigné"
        }</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Sujet :</td><td>${subject}</td></tr>
      </table>
      <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin-bottom:24px;">
        <strong style="display:block;margin-bottom:8px;">Message :</strong>
        <div style="white-space:pre-line;color:#334155;">${message}</div>
      </div>
      <p style="font-size:13px;color:#64748b;">Ce message a été envoyé le ${new Date().toLocaleString(
        "fr-FR"
      )}.</p>
    </div>
  `

  const mailOptions = {
    from: `"${firstname} ${lastname}" <${email}>`,
    to: process.env.CONTACT_TO,
    subject: `[Contact site] ${subject}`,
    text: `
      Prénom: ${firstname}
      Nom: ${lastname}
      Email: ${email}
      Téléphone: ${phone || "Non renseigné"}
      Sujet: ${subject}
      Message: ${message}
    `,
    html,
  }

  // Accusé de réception à l'expéditeur
  const confirmationHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fafbfc;border-radius:12px;border:1px solid #e5e7eb;">
      <h2 style="color:#2563eb;margin-bottom:8px;">Merci pour votre message !</h2>
      <p style="margin-bottom:16px;">
        Bonjour ${firstname},<br>
        Nous avons bien reçu votre demande via le site <strong>La Kokosphere</strong>.<br>
        Nous vous répondrons dans les plus brefs délais.<br><br>
        <strong>Récapitulatif de votre message :</strong>
      </p>
      <table style="width:100%;margin-bottom:24px;">
        <tr><td style="font-weight:bold;padding:4px 0;">Sujet :</td><td>${subject}</td></tr>
      </table>
      <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin-bottom:24px;">
        <strong style="display:block;margin-bottom:8px;">Message :</strong>
        <div style="white-space:pre-line;color:#334155;">${message}</div>
      </div>
      <p style="font-size:13px;color:#64748b;">Cet email est généré automatiquement, merci de ne pas y répondre.</p>
    </div>
  `

  const confirmationMail = {
    from: `"La Kokosphere" <${process.env.CONTACT_TO}>`,
    to: email,
    subject: "Votre message a bien été reçu – La Kokosphere",
    text: `Bonjour ${firstname},\n\nNous avons bien reçu votre message et vous répondrons rapidement.\n\nSujet : ${subject}\nMessage : ${message}\n\nCeci est un accusé de réception automatique.`,
    html: confirmationHtml,
  }

  try {
    await transporter.sendMail(mailOptions)
    // Envoi de l'accusé de réception (on ignore l'erreur si ça échoue)
    try {
      await transporter.sendMail(confirmationMail)
    } catch (e) {
      console.warn("Erreur lors de l'envoi de l'accusé de réception :", e.message)
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Message envoyé !" }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    }
  }
}
