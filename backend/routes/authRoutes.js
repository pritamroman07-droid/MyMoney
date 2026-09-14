import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: 'Unable to create account' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: 'Unable to log in' })
  }
})

// GET /api/auth/me — get current user
router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  } catch {
    return res.status(401).json({ message: 'Not authenticated' })
  }
})

export default router
