var parseQueryDateRange = (req, res, next) => {
  let date = new Date()
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  let startDate = req.query.startDate ? new Date(req.query.startDate) :
    firstDay
  let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date()
  let oneAndAHalfMonths = 1000 * 60 * 60 * 24 * 45
  if (endDate - startDate > oneAndAHalfMonths) return res.send(new Error('DateRangeTooWideError'))
  if (endDate < startDate) return res.send(new Error('InvalidDateParamsError'))
  let dateRange = {
    '$gte': startDate,
    '$lt': endDate
  }
  delete req.query.endDate
  delete req.query.startDate
  req.query.date = dateRange
  next()
}
module.exports.parseQueryDateRange = parseQueryDateRange
