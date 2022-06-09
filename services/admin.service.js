const userProvider = require('../providers/user.provider');
const adminProvider = require('../providers/admin.provider');
const CONSTANTS = require('../constants/');

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

class AdminService {
  async signUp({ password, email, adminId }) {
    const preparedEmail = email.toLowerCase();

    if (!CONSTANTS.VALIDATION.EMAIL_REGEXP.test(preparedEmail)) {
      return { status: 401 };
    }

    const [checkEmail, signUpRequester] = await Promise.all([
      adminProvider.getSingle({ email: preparedEmail }),
      adminProvider.getSingleById(adminId),
    ]);

    if (!signUpRequester) {
      return { status: 403 };
    }

    if (checkEmail) {
      return { status: 401 };
    }

    const hashedPassword = await argon2.hash(password);

    const adminRecord = await adminProvider.createSingle({
      password: hashedPassword,
      email: preparedEmail,
      role: CONSTANTS.ROLES.ADMIN,
    });

    return {
      user: {
        email: adminRecord.email,
        adminId: adminRecord._id,
      },
    };
  }

  async signIn(email, password) {
    const admin = await adminProvider.getSingle({ email });

    if (!admin) {
      return { status: 401 };
    }

    const correctPassword = await argon2.verify(admin.password, password);

    if (!correctPassword) {
      return { status: 401 };
    }

    const token = jwt.sign(
      { email: admin.email, adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    await adminProvider.updateSingle({ _id: admin._id }, { token });

    return {
      admin: {
        email: admin.email,
        adminId: admin._id,
        role: admin.role,
        token,
      },
    };
  }
}

module.exports = new AdminService();
