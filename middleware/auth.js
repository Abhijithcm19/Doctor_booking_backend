import dotenv from "dotenv";
dotenv.config();

export function localVariables(req, res, next) {
  const { name, password, photo, email, role, gender } = req.body;

  req.app.locals = {
    OTP: null,
    resetSession: false,
    registrationData: {
      name,
      password,
      photo,
      email,
      role,
      gender,
    },
  };

  next();
}
