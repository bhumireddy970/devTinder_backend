const Validator = require("validator");

const validatingUser = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  }
  if (!Validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  }
  if (!Validator.isStrongPassword(password)) {
    throw new Error("Password is not a strong password");
  }
};

const validateEditProfile = (req) => {
  const allowedEdit = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "aboutMe",
    "profilePicture",
  ];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEdit.includes(field)
  );
  return isAllowed;
};

module.exports = {
  validatingUser,
  validateEditProfile,
};
