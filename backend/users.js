/* eslint-disable max-len */
const getUserName = (displayName, id) => (displayName !== 'Guest' ? displayName : `${displayName}_${id}`);

module.exports = { getUserName };
