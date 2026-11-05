import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    text: `Use this link to reset your password: ${resetLink}`,
    html: `
      <h2>Password Reset</h2>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};
