export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`)
  const status = err.status || 500
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  })
}

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
