

// controllers/UserController.js
const User = require('../../models/UserSchema');

module.exports = {
  register: async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
  },
};
