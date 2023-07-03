const nodemailer = require("nodemailer");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const { PasswordTable } = require("../model/index");
const resetPasswordForm = require("../views/resetPassword");
const forgetPass = async (req, res) => {
  const email = req.body.email;
  try {
    const userdata = await User.findOne({
      where: {
        email: email,
      },
    });
    if (userdata) {
      const resetRequest = await PasswordTable.create({
        UserId: userdata.id,
        isActive: true,
      });
      res.status(200).json({
        success: true,
        message: "Check your mail",
      });
      sendMail(email, resetRequest.id);
    } else {
      res.status(200).json({
        success: true,
        message: "This Email does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const sendMail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'herminio.padberg@ethereal.email',
        pass: 'jnTeuYH4NXy43nfp92'
      }
    });

    let message = {
      from: '"Sudipta Jana 👻" <sudipta@gmail.com>',
      to: email,
      subject: "Password reset request ✔",
      text: "Use this links to reset your password",
      html: `<b>Use this link to reset your password <br> link :-<a href="http://localhost:3000/api/nodemail/reset-password?token=${token}">Click here</a></b>`,
    };

    let info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  const token = req.query.token;
  console.log("I am here ");
  try {
    const userdata = await PasswordTable.findOne({
      where: {
        id: token,
        isActive: true,
      },
      include: User,
    });
    let email = userdata.User.email;
    if (userdata) {
      res.send(resetPasswordForm(email, token));
    } else {
      res.send("user is not valide");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updatNewPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (updatedUser) {
      updatedUser.password = hashedPassword;
      await updatedUser.save();
      const passwordTableEntry = await PasswordTable.findOne({
        where: {
          id: token,
          isActive: true,
        },
      });
      if (passwordTableEntry) {
        passwordTableEntry.isActive = false;
        await passwordTableEntry.save();
      }
      return res.status(200).json({ message: 'Password updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while updating the password' });
  }
};


module.exports = {
  forgetPass,
  resetPassword,
  updatNewPassword,
};
