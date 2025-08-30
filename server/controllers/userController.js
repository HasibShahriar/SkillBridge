import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const user = new User({ firstname, lastname, email, password });
    /*const { name, email } = req.body;
    const user = new User({ name, email });*/
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
