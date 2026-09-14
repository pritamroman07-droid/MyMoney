import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
  },
}, {
  timestamps: true,
})

budgetSchema.index({ user: 1, month: 1 }, { unique: true })

const Budget = mongoose.model('Budget', budgetSchema)

export default Budget
