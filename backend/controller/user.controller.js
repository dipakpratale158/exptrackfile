const { User } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//. Save the user data to Database
const saveData = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "Signup was successful!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred during signup.",
    });
  }
};

// This will check the user isValid or not
const loginUser = async (req, res) => {
  try {
    // This will search the user using email
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    console.log('user in login: ', user);
    if (user) {
      // This will compare the password thats come with body
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        // Generating token using jwt
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          message: "Authentication successful!",
          token: token,
        });
      } else {
        res.status(401).json({
          error: "Authentication failed! Invalid password.",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed! User not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred during authentication.",
    });
  }
};

module.exports = {
  saveData,
  loginUser,
};
