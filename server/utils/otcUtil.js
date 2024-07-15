const crypto = require("crypto");
const nodemailer = require("nodemailer");
const OTC = require("../models/otcModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "luxurystay10@gmail.com",
    pass: "ctqe fmmr ljmy yvli",
  },
});

const generateOTC = () => {
  const digits = 6;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
};

const sendOTC = (email, otc) => {
  const mailOptions = {
    from: '"Luxury Stay" <luxurystay10@gmail.com>',
    to: email,
    subject: "Your One-Time Code (OTC)",
    text: `Your one-time code is: ${otc} \n this code expires in 10 minutes`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};
const generateAndSendOTC = async (email) => {
  const otc = generateOTC();
  await sendOTC(email, otc); 

  
  const savedOtc = await OTC.findOne({ email });

  if (savedOtc) {
    await OTC.findOneAndUpdate(
      { email },
      { otc, createdAt: new Date() },
      { new: true }
    );
  } else {
    await OTC.create({
      email,
      otc,
      createdAt: new Date(),
    });
  }

  return otc;
};

module.exports = { generateAndSendOTC };
