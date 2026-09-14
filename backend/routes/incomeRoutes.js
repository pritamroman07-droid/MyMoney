import express from 'express'
import Income from '../models/Income.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// GET /api/income
router.get('/', async (req, res) => {
  try {
    const income = await Income.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(income)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load income' })
  }
})

// POST /api/income
router.post('/', async (req, res) => {
  try {
    const { amount, date } = req.body

    if (!amount || !date) {
      return res.status(400).json({ message: 'Please provide amount and date' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    const income = await Income.create({
      user: req.userId,
      amount,
      date,
    })
    res.status(201).json({ message: 'Income added successfully', income })
  } catch (error) {
    res.status(500).json({ message: 'Unable to add income' })
  }
})

// PUT /api/income/:id
router.put('/:id', async (req, res) => {
  try {
    const { amount, date } = req.body

    if (!amount || !date) {
      return res.status(400).json({ message: 'Please provide amount and date' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { amount, date },
      { new: true }
    )

    if (!income) {
      return res.status(404).json({ message: 'Income not found' })
    }

    res.json({ message: 'Income updated successfully', income })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update income' })
  }
})

// DELETE /api/income/:id
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!income) {
      return res.status(404).json({ message: 'Income not found' })
    }

    res.json({ message: 'Income deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete income' })
  }
})

export default router
