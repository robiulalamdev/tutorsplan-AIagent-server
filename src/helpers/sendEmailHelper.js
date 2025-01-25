const VARIABLES = require("../config");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_KEY);

const sendVerifyEmail = async (user, token) => {
  try {
    const result = await sendgrid.send({
      from: VARIABLES.SENDRID_MAIL,
      personalizations: [
        {
          to: [user?.email],
          dynamicTemplateData: {
            username: user?.username,
            verify_link: `${VARIABLES.CLIENT_URL}/auth/verify/${token}`,
          },
        },
      ],
      //   subject: "Verify Your Email Address",
      templateId: "d-c9d27528e25042bd97adfe21605ae0f0",
    });
    return {
      success: true,
      message: "Mail send successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: true,
      message: "Mail send successfully",
      error_message: error?.message,
      data: null,
    };
  }
};

const sendForgotPasswordMail = async (user, token) => {
  try {
    const result = await sendgrid.send({
      from: VARIABLES.SENDRID_MAIL,
      personalizations: [
        {
          to: [user?.email],
          dynamicTemplateData: {
            username: user?.username,
            reset_link: `${VARIABLES.CLIENT_URL}/auth/change-password/${token}`,
          },
        },
      ],
      //   subject: "Forgot Password - Reset Your Password",
      templateId: "d-5315097b1a3d43f3b84b21b2b875b939",
    });
    return {
      success: true,
      message: "Mail send successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: true,
      message: "Mail send successfully",
      error_message: error?.message,
      data: null,
    };
  }
};

const sendContactMessage = async (data) => {
  try {
    const result = await sendgrid.send({
      from: VARIABLES.SENDRID_MAIL,
      personalizations: [
        {
          to: [VARIABLES.CONTACT_MAIL],
          dynamicTemplateData: {
            name: data?.name,
            email: data?.email,
            subject: data?.subject,
            message: data?.message,
          },
        },
      ],
      //   subject: "New Contact Us Form Submission",
      templateId: "d-14c1fe1bd3084cf4a9684845de58d1f1",
    });
    return {
      success: true,
      message: "Mail send successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: true,
      message: "Mail send successfully",
      error_message: error?.message,
      data: null,
    };
  }
};

module.exports = {
  sendVerifyEmail,
  sendForgotPasswordMail,
  sendContactMessage,
};
