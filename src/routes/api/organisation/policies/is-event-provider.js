const createError = require('http-errors');

/**
 * Check if user is an event provider
 * @param {*} user Api.User
 * @param {*} site Api.Site
 * @returns
 */
module.exports = async function isEventProvider(user, site) {
  const hasPermission =
    ['admin', 'moderator', 'editor'].includes(user.role) ||
    user.isEventProvider;
  if (!hasPermission) {
    throw createError(403, 'Je bent geen aanbieder');
  }
  return true;
};
