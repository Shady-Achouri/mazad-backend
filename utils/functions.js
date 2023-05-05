/**
 * function that returns a random 4 digit code
 * @returns {Number} return random number
 */
exports.randomCodeNumber = () => {
  return Math.floor(Math.random() * 9000 + 1000);
};
