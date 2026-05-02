const mongoose = require('mongoose')

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '')

const isNonEmptyString = (value) => normalizeString(value).length > 0

const isPositiveNumber = (value) => Number.isFinite(Number(value)) && Number(value) > 0

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

const isValidUrlOrEmpty = (value) => {
  if (value === undefined || value === null || value === '') return true
  try {
    const parsed = new URL(String(value))
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

module.exports = {
  normalizeString,
  isNonEmptyString,
  isPositiveNumber,
  isValidObjectId,
  isValidUrlOrEmpty,
}
