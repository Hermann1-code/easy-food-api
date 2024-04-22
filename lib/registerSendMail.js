const nodemailer = require("nodemailer");

const sendEmail = (email, verifyCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "hermann.assie.code@gmail.com", pass: process.env.CODE2 },
  });

  const mailOptions = {
    from: "Easy food",
    to: `${email}`,
    subject: "Test",
    html: `Votre code de verification est : \n <b>${verifyCode}</b>`,
    // text: ``,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Mail sending");
    }
  });
};

module.exports = sendEmail;
