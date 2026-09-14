import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
}, {
  timestamps: true,
})

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
