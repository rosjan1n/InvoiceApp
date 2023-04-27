const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../../database/models/User');
const config = require('../../config/config');

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, avatar } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error('Uzupełnij wszystkie pola!')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('Konto o takim mailu już istnieje.')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    username,
    email,
    avatar,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

const addActivity = asyncHandler(async (req, res) => {
  const id = req.id;
  const newActivity = req.body;
  try {
    const user = User.findById(id);

    if(!req.user) {
      res.status(400)
      throw new Error('Nieznaleziono konta')
    }

    if(!user) {
      res.status(400)
      throw new Error('Nieznaleziono konta')
    }

    if (user._id.toString() !== id) {
      res.status(401)
      throw new Error('Brak autoryzacji')
    }
    user.activities.push(newActivity);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt_secret, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  addActivity,
  getMe,
}