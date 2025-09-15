import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// POST /api/user/register
export const newUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    
    if(!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    /*
    const validationRes = await axios.get("https://api.zerobounce.net/v2/validate", {
      params: {
        api_key: process.env.ZERBOUNCE_API_KEY,
        email: email
      }
    });

    if (validationRes.data.status !== "valid") {
      return res.status(400).json({ message: "Invalid email address." });
    }
    */

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
      firstname, 
      lastname, 
      email, 
      password: hashedPassword,
      bio: "",
      socialLinks: { facebook: "", instagram: "", twitter: "" },
      courses: []
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email
      }
    }); 
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/user/profile/:id 
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/profile/:id 
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { 
      name,
      firstname,
      lastname,
      bio, 
      socialLinks, 
      courses, 
      phone, 
      address 
    } = req.body;
  
    if (name !== undefined) user.name = name; 
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (bio !== undefined) user.bio = bio;
    if (socialLinks !== undefined) user.socialLinks = socialLinks; // This was the main issue
    if (courses !== undefined) user.courses = courses;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      bio: updatedUser.bio,
      socialLinks: updatedUser.socialLinks,
      courses: updatedUser.courses,
      phone: updatedUser.phone,
      address: updatedUser.address
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: "Server error" });
  }
};