// routes/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registers any user model (Bidder or TenderCreator)
export const registerUser = async (Model, req, res) => {
  const { name, email, password, walletAddress, companyName, role } = req.body;

  if (!name || !email || !password || !walletAddress || !companyName || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const newUser = new Model({
      name,
      email,
      password,
      walletAddress,
      companyName,
    });

    await newUser.save();

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.walletAddress,
      role: role,
    };
    console.log("User registered:", userResponse);
    const token = jwt.sign({ userResponse }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      message: `${Model.modelName} registered successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login for any user model
export const loginUser = async (Model, role, req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `${Model.modelName} not found` });
    }
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.walletAddress,
    };

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (Model, req, res) => {
  try {
    const user = await Model.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: `${Model.modelName} not found` });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (Model, req, res) => {
  const { name, email, walletAddress, companyName } = req.body;

  try {
    const updatedUser = await Model.findByIdAndUpdate(
      req.user.id,
      { name, email, walletAddress, companyName },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: `${Model.modelName} not found` });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProfile = async (Model, req, res) => {
  try {
    const deletedUser = await Model.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ error: `${Model.modelName} not found` });
    }

    res
      .status(200)
      .json({ message: `${Model.modelName} account deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
