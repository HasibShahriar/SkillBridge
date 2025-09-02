import User from '../models/User.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user });  
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
