import express from 'express'
import Transaction from '../models/Transaction.js'

const router = express.Router()

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 })
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

    const transaction = await Transaction.create({ amount, category, date })
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

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
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
    const transaction = await Transaction.findByIdAndDelete(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete expense' })
  }
})

export default router
