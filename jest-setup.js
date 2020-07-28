module.exports = async () => {
  process.env.TZ = "UTC";
  process.env.IS_JEST = true;
};
