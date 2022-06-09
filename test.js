const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

////
(async () =>
  console.log(
    jwt.sign(
      { adminId: '62a11a400daa0af7553b4cf2', email: 'tomyoll.dev@gmail.com', role: 1 },
      '95bdc0757f93a93e224000d836ba804a3ae90bcc50ca8983987029a6ac9217856a740e68d89e4a01d5888ec690eeab5a485c7e8ae8cb58b491f957fd2a622d9c',
      { expiresIn: '900s' }
    )
  ))();
