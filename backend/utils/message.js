// backend/utils/message.js

module.exports = {
    success: (msg, data = {}) => ({
      status: 'success',
      message: msg,
      data,
    }),
  
    error: (msg, data = {}) => ({
      status: 'error',
      message: msg,
      data,
    }),
  };
  