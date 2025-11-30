const nodemailer = require('nodemailer');

// Configuration du transporteur email
// En développement, on peut utiliser Ethereal Email (gratuit) ou Gmail
// Pour un site portfolio, on simule l'envoi mais on prépare pour la production
const createTransporter = () => {
  // Si des variables d'environnement sont configurées, utiliser un vrai service
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Sinon, créer un transporteur test (qui n'envoie pas vraiment mais log)
  // En développement, utilise Ethereal Email (faux SMTP)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'ethereal.pass'
    }
  });
};

// Templates d'emails
const emailTemplates = {
  welcome: (user) => ({
    subject: 'Bienvenue chez Luxetime 🕰️',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center; color: white; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕰️ Luxetime</h1>
            <p>Boutique de Montres de Luxe</p>
          </div>
          <div class="content">
            <h2>Bienvenue ${user.prenom} ${user.nom} !</h2>
            <p>Nous sommes ravis de vous compter parmi nos clients.</p>
            <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
            <ul>
              <li>Parcourir notre collection exclusive de montres de luxe</li>
              <li>Créer votre liste de souhaits</li>
              <li>Suivre vos commandes</li>
              <li>Accéder à des services premium</li>
            </ul>
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Découvrir la collection</a>
            </center>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>Cordialement,<br>L'équipe Luxetime</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Luxetime. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (order, user) => ({
    subject: `Confirmation de commande #${order.numero}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center; color: white; }
          .content { background: #f9f9f9; padding: 30px; }
          .order-info { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .items { margin: 20px 0; }
          .item { padding: 10px; background: white; margin: 5px 0; }
          .total { font-size: 20px; font-weight: bold; color: #d4af37; text-align: right; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕰️ Commande Confirmée</h1>
          </div>
          <div class="content">
            <h2>Merci pour votre commande ${user.prenom} !</h2>
            <p>Votre commande <strong>#${order.numero}</strong> a été confirmée et est en cours de traitement.</p>
            
            <div class="order-info">
              <h3>Détails de la commande</h3>
              <p><strong>Numéro:</strong> ${order.numero}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              <p><strong>Statut:</strong> ${order.statut}</p>
              <p><strong>Méthode de paiement:</strong> ${order.methodePaiement}</p>
            </div>

            <div class="items">
              <h3>Articles commandés</h3>
              ${order.items && order.items.map(item => `
                <div class="item">
                  <strong>${item.nomProduit}</strong> - Quantité: ${item.quantite} - ${(item.prixUnitaire * item.quantite).toFixed(2)}€
                </div>
              `).join('')}
            </div>

            <div class="total">
              <p>Sous-total: ${order.sousTotal.toFixed(2)}€</p>
              <p>Livraison: ${order.fraisLivraison.toFixed(2)}€</p>
              ${order.reduction > 0 ? `<p>Réduction: -${order.reduction.toFixed(2)}€</p>` : ''}
              <p>Total: ${order.total.toFixed(2)}€</p>
            </div>

            <p>Vous recevrez un email de confirmation lorsque votre commande sera expédiée.</p>
            <p>Cordialement,<br>L'équipe Luxetime</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Luxetime. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderShipped: (order, user, trackingNumber) => ({
    subject: `Votre commande #${order.numero} a été expédiée`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center; color: white; }
          .content { background: #f9f9f9; padding: 30px; }
          .tracking { background: white; padding: 20px; margin: 20px 0; border: 2px solid #d4af37; text-align: center; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Commande Expédiée</h1>
          </div>
          <div class="content">
            <h2>Excellente nouvelle ${user.prenom} !</h2>
            <p>Votre commande <strong>#${order.numero}</strong> a été expédiée.</p>
            
            ${trackingNumber ? `
              <div class="tracking">
                <h3>Numéro de suivi</h3>
                <p style="font-size: 24px; font-weight: bold; color: #d4af37;">${trackingNumber}</p>
                <p>Vous pouvez suivre votre colis avec ce numéro sur le site du transporteur.</p>
              </div>
            ` : ''}

            <p>Votre commande devrait arriver sous 2-5 jours ouvrables.</p>
            <p>Merci de votre confiance,<br>L'équipe Luxetime</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Luxetime. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (user, resetLink) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); padding: 30px; text-align: center; color: white; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${user.prenom},</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <center>
              <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
            </center>
            <div class="warning">
              <p><strong>⚠️ Important:</strong> Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            </div>
            <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            <p>Cordialement,<br>L'équipe Luxetime</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Luxetime. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

class EmailService {
  // Envoyer un email
  static async sendEmail(to, template, data) {
    try {
      // Si en mode développement sans config email, simuler l'envoi
      if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_HOST) {
        console.log('📧 EMAIL SIMULATION - Email envoyé à:', to);
        console.log('📧 Sujet:', template.subject);
        console.log('📧 Template:', template.html.substring(0, 100) + '...');
        return {
          success: true,
          message: 'Email simulé (mode développement)',
          preview: template.html
        };
      }

      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Luxetime" <noreply@luxetime.fr>',
        to,
        subject: template.subject,
        html: template.html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Email envoyé:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      // En développement, ne pas faire échouer l'application
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 EMAIL SIMULATION (erreur ignorée en dev)');
        return {
          success: true,
          message: 'Email simulé (erreur ignorée en développement)'
        };
      }
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
  }

  // Email de bienvenue
  static async sendWelcomeEmail(user) {
    const template = emailTemplates.welcome(user);
    return await this.sendEmail(user.email, template, user);
  }

  // Email de confirmation de commande
  static async sendOrderConfirmation(order, user) {
    const template = emailTemplates.orderConfirmation(order, user);
    return await this.sendEmail(user.email, template, { order, user });
  }

  // Email de commande expédiée
  static async sendOrderShipped(order, user, trackingNumber) {
    const template = emailTemplates.orderShipped(order, user, trackingNumber);
    return await this.sendEmail(user.email, template, { order, user, trackingNumber });
  }

  // Email de réinitialisation de mot de passe
  static async sendPasswordReset(user, resetLink) {
    const template = emailTemplates.passwordReset(user, resetLink);
    return await this.sendEmail(user.email, template, { user, resetLink });
  }
}

module.exports = EmailService;

