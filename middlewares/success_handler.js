module.exports = function successHandler(data, message = 'success') {
  return this.json({
    data,
    success: true,
    message,
  });
};
