const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const adminProvider = require('../providers/admin.provider');

class AuthMiddleware {
  static getTokenFromRequest(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else {
      return false;
    }
  }

  static async authenticateToken(req, res, next) {
    try {
      const token = AuthMiddleware.getTokenFromRequest(req);

      console.log(token);

      if (!token) {
        return res.sendStatus(401);
      }

      const checkToken = await adminProvider.getSingle({ token });

      if (!checkToken) {
        return res.sendStatus(401);
      }

      const admin = jwt.verify(token, process.env.JWT_SECRET);

      req.adminId = admin.adminId;

      req.email = admin.email;

      req.role = admin.role;

      return next();
    } catch (e) {
      // if (e.message === 'jwt expired') {
      //   console.log('jwt expired');
      //   return res.status(200).send('expired');
      // }

      return res.sendStatus(401);
    }
  }

  static checkRole(req, res, next) {
    if (req.role === CONSTANTS.ROLES.SUPER_ADMIN) {
      return next();
    } else {
      return res.sendStatus(403);
    }
  }

  static async refreshToken(req, res, next) {
    const token = AuthMiddleware.getTokenFromRequest(req);

    const admin = await adminProvider.getSingle({ token });

    if (!admin) {
      return res.sendStatus(401);
    }

    const newToken = jwt.sign(
      { email: admin.email, adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    await adminProvider.updateSingle({ _id: admin._id }, { token: newToken });

    return res.status(200).send(newToken);
  }
}

module.exports = AuthMiddleware;
