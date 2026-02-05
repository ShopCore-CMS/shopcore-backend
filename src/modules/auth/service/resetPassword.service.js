const {
  createResendTransporter,
  getDefaultSender,
} = require("../../../shared/config/resend");
const logger = require("../../../shared/utils/logger");

/**
 * Password Reset Email Service
 * Handles sending password reset related emails using Resend
 */

/**
 * Send password reset email
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} params.resetURL - Password reset URL with token
 * @param {string} params.expiresIn - Token expiration time (e.g., "10 minutes")
 * @returns {Promise<Object>} Email send result
 */
const sendPasswordResetEmail = async ({ email, name, resetURL, expiresIn }) => {
  const transporter = createResendTransporter();

  const mailOptions = {
    from: getDefaultSender(),
    to: email,
    subject: "Password Reset Request - ShopCore CMS",
    html: generatePasswordResetHTML({ name, resetURL, expiresIn }),
    text: generatePasswordResetText({ name, resetURL, expiresIn }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`✓ Password reset email sent to ${email}`);
    logger.info(`Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    logger.error(
      `✗ Failed to send password reset email to ${email}:`,
      error.message,
    );
    throw error;
  }
};

/**
 * Send password reset confirmation email
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @returns {Promise<Object>} Email send result
 */
const sendPasswordResetConfirmationEmail = async ({ email, name }) => {
  const transporter = createResendTransporter();

  const mailOptions = {
    from: getDefaultSender(),
    to: email,
    subject: "✓ Password Reset Successful - ShopCore CMS",
    html: generatePasswordResetConfirmationHTML({ name }),
    text: generatePasswordResetConfirmationText({ name }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`✓ Password reset confirmation sent to ${email}`);
    return {
      success: true,
      messageId: info.messageId,
      message: "Password reset confirmation sent successfully",
    };
  } catch (error) {
    logger.error(
      `✗ Failed to send confirmation email to ${email}:`,
      error.message,
    );
    throw error;
  }
};

/**
 * Send password changed notification email
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @returns {Promise<Object>} Email send result
 */
const sendPasswordChangedEmail = async ({ email, name }) => {
  const transporter = createResendTransporter();

  const mailOptions = {
    from: getDefaultSender(),
    to: email,
    subject: "🔒 Password Changed - ShopCore CMS",
    html: generatePasswordChangedHTML({ name }),
    text: generatePasswordChangedText({ name }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`✓ Password changed notification sent to ${email}`);
    return {
      success: true,
      messageId: info.messageId,
      message: "Password changed notification sent successfully",
    };
  } catch (error) {
    logger.error(
      `✗ Failed to send password changed email to ${email}:`,
      error.message,
    );
    throw error;
  }
};

// ============================================================================
// EMAIL TEMPLATES - HTML
// ============================================================================

/**
 * Generate HTML template for password reset email
 */
const generatePasswordResetHTML = ({ name, resetURL, expiresIn }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password for your ShopCore CMS account. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetURL}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 16px 40px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
            Reset Password →
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin: 30px 0;">
          Or copy and paste this link in your browser:<br>
          <a href="${resetURL}" style="color: #667eea; word-break: break-all; font-size: 13px;">${resetURL}</a>
        </p>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 30px 0; border-radius: 5px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            ⚠️ <strong>Important:</strong> This link will expire in <strong>${expiresIn}</strong>.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          This is an automated email, please do not reply.<br>
          © ${new Date().getFullYear()} ShopCore CMS. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate HTML template for password reset confirmation email
 */
const generatePasswordResetConfirmationHTML = ({ name }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Successful</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✓ Password Reset Successful</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">Your password has been successfully reset. You can now login to your ShopCore CMS account with your new password.</p>
        
        <div style="text-align: center; margin: 30px 0;">
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
            Login to Your Account →
          </a>
        </div>
        
        <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 16px; margin: 30px 0; border-radius: 5px;">
          <p style="margin: 0; color: #0c5460; font-size: 14px;">
            ℹ️ <strong>Security Notice:</strong> If you didn't make this change, please contact our support team immediately at <a href="mailto:support@shopcore.com" style="color: #0c5460;">support@shopcore.com</a>
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
 * Generate HTML template for password changed notification email
 */
const generatePasswordChangedHTML = ({ name }) => {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Changed</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size: 16px;">Your account password has been changed successfully.</p>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 30px 0; border-radius: 5px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            ⚠️ If you didn't make this change, please secure your account immediately by resetting your password.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/forgot-password" 
             style="background: #f5576c; 
                    color: white; 
                    padding: 16px 40px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    display: inline-block;
                    font-weight: 600;">
            Reset Password
          </a>
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

// ============================================================================
// EMAIL TEMPLATES - PLAIN TEXT
// ============================================================================

/**
 * Generate plain text template for password reset email
 */
const generatePasswordResetText = ({ name, resetURL, expiresIn }) => {
  return `
Hi ${name},

We received a request to reset your password for your ShopCore CMS account.

Click this link to create a new password:
${resetURL}

⚠️ This link will expire in ${expiresIn}.

If you didn't request a password reset, please ignore this email.

---
© ${new Date().getFullYear()} ShopCore CMS
This is an automated email, please do not reply.
  `.trim();
};

/**
 * Generate plain text template for password reset confirmation email
 */
const generatePasswordResetConfirmationText = ({ name }) => {
  return `
Hi ${name},

Your password has been successfully reset.

You can now login to your ShopCore CMS account with your new password.

If you didn't make this change, please contact our support team immediately.

---
© ${new Date().getFullYear()} ShopCore CMS
  `.trim();
};

/**
 * Generate plain text template for password changed notification email
 */
const generatePasswordChangedText = ({ name }) => {
  return `
Hi ${name},

Your account password has been changed successfully.

If you didn't make this change, please secure your account immediately by resetting your password.

---
© ${new Date().getFullYear()} ShopCore CMS
  `.trim();
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendPasswordChangedEmail,
};
