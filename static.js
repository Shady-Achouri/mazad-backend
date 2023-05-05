module.exports = {
  MEDIA: {
    DIRECTORY: __dirname + "/public",
  },
  JWT: {
    KEY: "YGwh9iSGNNA9rgTw7hZVMG3KcTsiRaiQ8o7k3MFhK9gfJf5ghxtUArXHM4KvrGTH",
    EXPIRE_TIME: "90d",
  },
  BCRYPT_SALT_ROUND: 10,
  STATUS_REPORT: {
    PENDING: "pending",
    OPEN: "open",
    CLOSED: "closed",
  },
  RESTAURANT_TYPE: {
    FAST_FOOD: "Fast food",
    GHOST_RESTAURANT: "Ghost restaurant",
    FINE_DINING: "Fine dining",
    CASUAL_DINING: "Casual dining",
  },
};
