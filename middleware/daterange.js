const processDates = (req, res, next, id) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    delete req.query.startDate;
    delete req.query.endDate;
    next();
  }
  const currentDate = new Date();
  let fromDate, toDate;
  switch (id) {
    case "today":
      fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
      break;
    case "yesterday":
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      fromDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      toDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      break;
    case "tWeek":
      const tWeekStart = new Date(currentDate);
      tWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const tWeekEnd = new Date(currentDate);
      tWeekEnd.setDate(currentDate.getDate() - currentDate.getDay() + 6);
      fromDate = new Date(tWeekStart.getFullYear(), tWeekStart.getMonth(), tWeekStart.getDate(), 0, 0, 0);
      toDate = new Date(tWeekEnd.getFullYear(), tWeekEnd.getMonth(), tWeekEnd.getDate(), 23, 59, 59);
      break;
    case "lWeek":
      const lWeekStart = new Date(currentDate);
      lWeekStart.setDate(currentDate.getDate() - currentDate.getDay() - 7);
      const lWeekEnd = new Date(currentDate);
      lWeekEnd.setDate(currentDate.getDate() - currentDate.getDay() - 1);
      fromDate = new Date(lWeekStart.getFullYear(), lWeekStart.getMonth(), lWeekStart.getDate(), 0, 0, 0);
      toDate = new Date(lWeekEnd.getFullYear(), lWeekEnd.getMonth(), lWeekEnd.getDate(), 23, 59, 59);
      break;
    case "tMonth":
      fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
      toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      break;
    case "lMonth":
      const lMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      fromDate = new Date(lMonthStart.getFullYear(), lMonthStart.getMonth(), lMonthStart.getDate(), 0, 0, 0);
      toDate = new Date(lMonthEnd.getFullYear(), lMonthEnd.getMonth(), lMonthEnd.getDate(), 23, 59, 59);
      break;
    default:
      fromDate = new Date(req.query.startDate);
      toDate = new Date(req.query.endDate);
      break;
  }
  req.query.startDate = fromDate;
  req.query.endDate = toDate;
  next();
};
module.exports.processDates = processDates;
