import express from 'express'
import Budget from '../models/Budget.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// GET /api/budget — get current month's budget
router.get('/', async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const budget = await Budget.findOne({ user: req.userId, month: currentMonth })
    res.json(budget)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load budget' })
  }
})

// POST /api/budget — create or replace budget for current month
router.post('/', async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount) {
      return res.status(400).json({ message: 'Please provide an amount' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    const currentMonth = new Date().toISOString().slice(0, 7)
    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, month: currentMonth },
      { amount, month: currentMonth, user: req.userId },
      { new: true, upsert: true }
    )

    res.status(201).json({ message: 'Budget set successfully', budget })
  } catch (error) {
    res.status(500).json({ message: 'Unable to set budget' })
  }
})

// PUT /api/budget/:id — update budget
router.put('/:id', async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount) {
      return res.status(400).json({ message: 'Please provide an amount' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { amount },
      { new: true }
    )

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json({ message: 'Budget updated successfully', budget })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update budget' })
  }
})

// DELETE /api/budget/:id — delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json({ message: 'Budget deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete budget' })
  }
})

export default router
