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

const sendWelcomeNewsletterEmail = async (email) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.MAIL_FROM || `"RecipeHub Updates" <noreply@recipehub.com>`,
    to: email,
    subject: `🎉 Welcome to the RecipeHub Newsletter!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #ea580c; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Welcome to RecipeHub!</h2>
        <p>Hello Food Enthusiast,</p>
        <p>Thank you for subscribing to the RecipeHub newsletter. You will now receive weekly recipe highlights, chef tips, and global culinary updates directly in your inbox.</p>
        <p>Stay tuned for our upcoming culinary highlights!</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;"/>
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">RecipeHub V2 - Culinary Newsletter Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}: ${error.message}`);
  }
};

const sendNewRecipeNewsletterEmail = async (recipe, subscriberEmails) => {
  if (!subscriberEmails || subscriberEmails.length === 0) return;
  const transporter = createTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  for (const email of subscriberEmails) {
    const mailOptions = {
      from: process.env.MAIL_FROM || `"RecipeHub Updates" <noreply@recipehub.com>`,
      to: email,
      subject: `🍳 New Recipe Alert: ${recipe.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #f97316; padding-bottom: 10px;">New Recipe Approved on RecipeHub!</h2>
          <p>Hello Food Lover,</p>
          <p>A delicious new recipe has been added to our catalog and is waiting for you to try it out!</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <img src="${recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'}" alt="${recipe.name}" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />
            <h3 style="color: #1e293b; margin-top: 10px;">${recipe.name}</h3>
            <p style="color: #64748b; font-size: 14px;">Origin: ${recipe.origin} | Category: ${recipe.category}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
            <a href="${clientUrl}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Recipe Details</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;"/>
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">RecipeHub V2 - Culinary Newsletter Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Newsletter recipe alert email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send recipe alert to ${email}: ${err.message}`);
    }
  }
};

module.exports = {
  sendRecipeReviewNotification,
  sendWelcomeNewsletterEmail,
  sendNewRecipeNewsletterEmail
};
