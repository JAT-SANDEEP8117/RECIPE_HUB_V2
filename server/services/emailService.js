const nodemailer = require('nodemailer');

const createTransporter = () => {
  const secure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send an email notification to the administrator when a cook submits a recipe.
 * @param {object} recipe - The recipe document.
 * @param {string} cookName - Submitter's name.
 * @param {string} cookEmail - Submitter's email.
 * @returns {Promise<any>}
 */
const sendRecipeReviewNotification = async (recipe, cookName, cookEmail) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  const transporter = createTransporter();
  const reviewLink = `${clientUrl}/admin?review=${recipe._id}`;

  const mailOptions = {
    from: process.env.MAIL_FROM || `"RecipeHub Alerts" <noreply@recipehub.com>`,
    to: adminEmail,
    subject: `🍳 Recipe Submission Review: ${recipe.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #ea580c; border-bottom: 2px solid #f97316; padding-bottom: 10px;">New Recipe Review Request</h2>
        <p>Hello Admin,</p>
        <p>A new recipe has been submitted and is currently pending review.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; width: 120px;">Recipe Name:</td>
            <td style="padding: 10px;">${recipe.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Origin/Cuisine:</td>
            <td style="padding: 10px;">${recipe.origin}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold;">Category:</td>
            <td style="padding: 10px;">${recipe.category}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Submitted By:</td>
            <td style="padding: 10px;">${cookName} (${cookEmail})</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
          <a href="${reviewLink}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review Recipe Now</a>
        </div>
        
        <p style="font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this link in your browser: <br/> <a href="${reviewLink}">${reviewLink}</a></p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;"/>
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">RecipeHub V2 - Automatic Admin Notification System</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Review notification email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`SMTP Email failure: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendRecipeReviewNotification
};
