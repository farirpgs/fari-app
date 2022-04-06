module.exports = async () => {
  process.env.TZ = "UTC";

  // fixes an implementation problem in Canvas
  // that renders it difficult to test
  HTMLCanvasElement.prototype.getContext = () => {
    // from: https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
  };
};
