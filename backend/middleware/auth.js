import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Please log in again' })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Please log in again' })
  }
}

export default auth
