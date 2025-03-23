import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: {
        name: "SKI CTF",
        address: process.env.SMTP_USER,
    },
    to: email,
    subject: "Verify Your Email - SKI CTF",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 28px; margin: 0;">SKI CTF</h1>
            <div style="width: 50px; height: 4px; background-color: #0070f3; margin: 15px auto;"></div>
          </div>
          
          <h2 style="color: #1a1a1a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px; margin-bottom: 20px;">Welcome to SKI CTF!</h2>
          
          <p style="color: #4a5568; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining SKI CTF! To get started, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #4a5568; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #718096; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 25px; word-break: break-all;">
            ${verificationUrl}
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.6; margin: 0;">
              This verification link will expire in 24 hours for security reasons.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
