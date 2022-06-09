const adminProvider = require('../providers/admin.provider');
const adminService = require('../services/admin.service');

class AdminController {
  static async signUp(req, res) {
    const { password, email } = req.body;
    const { adminId, role } = req;

    const responseData = await adminService.signUp({ password, email, adminId });

    if (responseData.status) {
      return res.sendStatus(responseData.status);
    }

    return res.status(201).json(responseData);
  }

  static async signIn(req, res, next) {
    const { password, email } = req.body;

    const responseData = await adminService.signIn(email, password);

    if (responseData.status) {
      return res.sendStatus(responseData.status);
    }

    return res.status(200).json(responseData);
  }

  static async getProfile(req, res, next) {
    const { adminId } = req;

    const admin = await adminProvider.getSingleById(adminId, { _id: 1, email: 1, role: 1 });

    res.status(200).json({ admin });
  }
}

module.exports = AdminController;
