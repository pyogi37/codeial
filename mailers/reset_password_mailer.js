const nodemailer = require("../config/nodemailer");

exports.resetPassword = (accessToken) => {
  let htmlString = nodemailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );
  // console.log("inside newComment mailer");

  nodemailer.transporter.sendMail(
    {
      from: "me@codeial.com",
      to: comment.user.email,
      subject: "Reset password| Codeial",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending email", err);
        return;
      }
      // console.log("Message sent", info);
      return;
    }
  );
};
