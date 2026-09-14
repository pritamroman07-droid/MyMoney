import express from 'express'
import Transaction from '../models/Transaction.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: 'Unable to load transactions' })
  }
})

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { amount, category, date } = req.body

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide amount, category and date' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    const transaction = await Transaction.create({
      user: req.userId,
      amount,
      category,
      date,
    })
    res.status(201).json({ message: 'Expense added successfully', transaction })
  } catch (error) {
    res.status(500).json({ message: 'Unable to add expense' })
  }
})

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, date } = req.body

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide amount, category and date' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' })
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { amount, category, date },
      { new: true }
    )

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json({ message: 'Expense updated successfully', transaction })
  } catch (error) {
    res.status(500).json({ message: 'Unable to update expense' })
  }
})

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete expense' })
  }
})

export default router
