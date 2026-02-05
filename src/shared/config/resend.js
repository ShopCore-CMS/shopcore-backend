const nodemailer = require("nodemailer");

/**
 * Resend Email Configuration
 * Using Resend SMTP with Nodemailer
 *
 * Documentation: https://resend.com/docs/send-with-nodejs
 * API Reference: https://resend.com/docs/api-reference/introduction
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key
 * - EMAIL_FROM: Sender email address (must be verified domain)
 */

/**
 * Create Resend email transporter using SMTP
 * Resend SMTP Configuration:
 * - Host: smtp.resend.com
 * - Port: 587 (TLS) or 465 (SSL)
 * - Username: resend
 * - Password: Your Resend API Key
 */
const createResendTransporter = () => {
  // Validate required environment variables
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is required");
  }

  return nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587, // Use 587 for TLS or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: "resend", // Resend SMTP username is always "resend"
      pass: process.env.RESEND_API_KEY, // Your Resend API key
    },
    // Optional: Connection timeout
    connectionTimeout: 10000,
    // Optional: Socket timeout
    socketTimeout: 10000,
  });
};

/**
 * Get default sender email from environment
 */
const getDefaultSender = () => {
  return process.env.EMAIL_FROM;
};

/**
 * Verify transporter connection
 * Useful for testing email configuration
 */
const verifyConnection = async () => {
  try {
    const transporter = createResendTransporter();
    await transporter.verify();
    return { success: true, message: "Resend SMTP connection verified" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  createResendTransporter,
  getDefaultSender,
  verifyConnection,
};
