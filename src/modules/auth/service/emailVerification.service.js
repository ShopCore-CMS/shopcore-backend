const {
  createResendTransporter,
  getDefaultSender,
} = require("../../../shared/config/resend");
const logger = require("../../../shared/utils/logger");

/**
 * Email Verification Service
 * Handles sending email verification emails using Resend
 */

/**
 * Send email verification email
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} params.verificationURL - Email verification URL with token
 * @returns {Promise<Object>} Email send result
 */
const sendEmailVerificationEmail = async ({ email, name, verificationURL }) => {
  const transporter = createResendTransporter();

  const mailOptions = {
    from: getDefaultSender(),
    to: email,
    subject: "Verify Your Email - ShopCore CMS",
    html: generateEmailVerificationHTML({ name, verificationURL }),
    text: generateEmailVerificationText({ name, verificationURL }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`✓ Email verification sent to ${email}`);
    return {
      success: true,
      messageId: info.messageId,
      message: "Email verification sent successfully",
    };
  } catch (error) {
    logger.error(
      `✗ Failed to send verification email to ${email}:`,
      error.message,
    );
    throw error;
  }
};

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Generate HTML template for email verification
 */
const generateEmailVerificationHTML = ({ name, verificationURL }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">📧 Verify Your Email</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px;">Thank you for registering with ShopCore CMS! Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationURL}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 16px 40px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;">
            Verify Email Address →
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Or copy and paste this link:<br>
          <a href="${verificationURL}" style="color: #667eea; word-break: break-all;">${verificationURL}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} ShopCore CMS. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate plain text template for email verification
 */
const generateEmailVerificationText = ({ name, verificationURL }) => {
  return `
Hi ${name},

Thank you for registering with ShopCore CMS!

Please verify your email address by clicking this link:
${verificationURL}

---
© ${new Date().getFullYear()} ShopCore CMS
  `.trim();
};

/**
 * Send email verification success notification
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @returns {Promise<Object>} Email send result
 */
const sendEmailVerificationSuccessEmail = async ({ email, name }) => {
  const transporter = createResendTransporter();

  const mailOptions = {
    from: getDefaultSender(),
    to: email,
    subject: "✓ Email Verified Successfully - ShopCore CMS",
    html: generateEmailVerificationSuccessHTML({ name }),
    text: generateEmailVerificationSuccessText({ name }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`✓ Email verification success notification sent to ${email}`);
    return {
      success: true,
      messageId: info.messageId,
      message: "Email verification success notification sent successfully",
    };
  } catch (error) {
    logger.error(
      `✗ Failed to send verification success email to ${email}:`,
      error.message,
    );
    throw error;
  }
};

// ============================================================================
// EMAIL TEMPLATES - VERIFICATION SUCCESS
// ============================================================================

/**
 * Generate HTML template for email verification success
 */
const generateEmailVerificationSuccessHTML = ({ name }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified Successfully</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✓ Email Verified!</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
          Great news! Your email address has been successfully verified. Your ShopCore CMS account is now fully activated.
        </p>
        
        <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 16px; margin: 30px 0; border-radius: 5px;">
          <p style="margin: 0; color: #155724; font-size: 14px;">
            ✓ <strong>Your account is ready!</strong> You can now access all features of ShopCore CMS.
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL}/login" 
             style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); 
                    color: white; 
                    padding: 16px 40px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 6px rgba(17, 153, 142, 0.3);">
            Go to Dashboard →
          </a>
        </div>
        
        <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 16px; margin: 30px 0; border-radius: 5px;">
          <p style="margin: 0; color: #0c5460; font-size: 14px;">
            ℹ️ <strong>Need Help?</strong> Check out our <a href="${process.env.FRONTEND_URL}/help" style="color: #0c5460; text-decoration: underline;">help center</a> or contact support at <a href="mailto:support@shopcore.com" style="color: #0c5460;">support@shopcore.com</a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} ShopCore CMS. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate plain text template for email verification success
 */
const generateEmailVerificationSuccessText = ({ name }) => {
  return `
Hi ${name},

Great news! Your email address has been successfully verified.

Your ShopCore CMS account is now fully activated and you can access all features.

Login to your account: ${process.env.FRONTEND_URL}/login

Need help? Visit our help center or contact support@shopcore.com

---
© ${new Date().getFullYear()} ShopCore CMS
  `.trim();
};

module.exports = {
  sendEmailVerificationEmail,
  sendEmailVerificationSuccessEmail,
};
