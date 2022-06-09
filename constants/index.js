module.exports = {
  MODELS: {
    ACTUAL_NEWS: 'ActualNews',
    ALL_NEWS: 'AllNews',
    NAVIGATION: 'Navigation',
    LINK: 'Link',
    USER_STATE: 'UserState',
    FIRST_PAGE: 'firstPage',
    USER: 'User',
    ADMIN: 'Admin',
  },
  VALIDATION: {
    SPEC_SYMBOLS: /[-[\]{}()*+?`"<>.,\\/^$|#\s]/g,
    EMAIL_REGEXP:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },

  ROLES: {
    ADMIN: 0,
    SUPER_ADMIN: 1,
  },
};
