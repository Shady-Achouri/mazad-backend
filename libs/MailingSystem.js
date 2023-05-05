const ENV = require("../static");
const Agent = require("../mails/Agent");
const Templates = require("../mails/Templates");
const nodemailer = require("nodemailer");



exports.userRegister = (email, user, key) =>
  new Promise((resolve, reject) => {
    try {
      const mailOptions = {
        from: ENV.EMAIL.SENDER,
        to: email,
        subject: "Activation du votre compte sur Swii",
        // eslint-disable-next-line no-underscore-dangle
        html: Templates.registerMobileTemplate(
          user,
          `${ENV.URL}/activate/${user._id}?token=${key}`
        ),
      };
      return Agent.sendMail(mailOptions, (error, response) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve(response);
      });
    } catch (e) {
      return reject(new Error(e.message));
    }
  });

exports.userReset = ( email,user,token) =>
  new Promise((resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        pool: true,
        maxConnections: 2,
        // max
        // Messages: 10,
        host: ENV.EMAIL.HOST,
        port: ENV.EMAIL.PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: ENV.EMAIL.EMAIL, // generated ethereal user
          pass: ENV.EMAIL.PASSWORD, // generated ethereal password
        },
      });
      const mailOptions = {
        from: ENV.EMAIL.SENDER,
        to: email,
        subject: "Reset du votre compte sur Swii",
        // eslint-disable-next-line no-underscore-dangle
        html: Templates.resetTemplate(
          user,
          `${ENV.URL}/reset-password/${user._id}?token=${token}`
        ),
      };
      
      return transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve(response);
      });
    } catch (e) { 
      return reject(new Error(e.message));
    }
  });


exports.sendEmailFromAdmin = ( user) =>
  new Promise((resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        pool: true,
        maxConnections: 2,
        host: ENV.EMAIL.HOST,
        port: ENV.EMAIL.PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: ENV.EMAIL.EMAIL, // generated ethereal user
          pass: ENV.EMAIL.PASSWORD, // generated ethereal password
        },
      });
      const mailOptions = {
        from: ENV.EMAIL.SENDER,
        to: user.email,
        subject: "Hello from Admin ",
        // eslint-disable-next-line no-underscore-dangle
        html: Templates.messageFromAdmin(
          user
        ),
      };
      
      return transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
          return reject(new Error(error.message));
        }
        return resolve(response);
      });
    } catch (e) { 
      return reject(new Error(e.message));
    }
  });
