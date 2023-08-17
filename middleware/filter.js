const filter = (req, res, next) => {
  const { query } = req;
  const filter = { ...query };

  Object.entries(filter).forEach(([key, value]) => {
    if (
      key === "startDate" ||
      key === "endDate" ||
      value === "" ||
      key === "skip" ||
      key === "limit" ||
      key === "searchkey" ||
      key === "id" ||
      key === "_id"
    ) {
      delete filter[key];
    }
  });

  req.filter = filter;
  next();
};

module.exports.reqFilter = filter;
