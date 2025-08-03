// utils/logger.js
const log = (msg) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${msg}`);
};

module.exports = { log };
