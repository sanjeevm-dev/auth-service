import nodemailer from "nodemailer";

const sendMail = async ({ sender, receiver, htmlContent, subject }) => {
  if (
    !sender ||
    !receiver ||
    !htmlContent ||
    !process.env.MAIL_SERVICE ||
    !process.env.MAIL_USER ||
    !process.env.MAIL_PASS
  ) {
    console.error("Error: sending email missing required parameters.");
    return {
      success: false,
      message: "Missing required parameters.",
    };
  }
  try {
    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Define the mail options
    const mailOptions = {
      from: sender,
      to: receiver,
      subject: subject || "New News Articles",
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.info("Email sent successfully: ", info.response);

    return {
      success: true,
      message: "Email sent successfully",
      info,
    };
  } catch (error) {
    console.error("Error sending email: ", error);

    // Handle specific error types
    if (error.code === "EAUTH") {
      return {
        success: false,
        message: "Authentication failed. Please check your email credentials.",
      };
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNECTION") {
      return {
        success: false,
        message:
          "Unable to connect to the email service. Please try again later.",
      };
    } else {
      return {
        success: false,
        message: "An unexpected error occurred while sending the email.",
        error,
      };
    }
  }
};

export default sendMail;
