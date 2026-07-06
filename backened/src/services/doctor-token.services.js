import jwt from "jsonwebtoken";

const generatedoctorAccessTokens = (doctor) => {
  return jwt.sign(
    {
      id: doctor._id,
      role: doctor.role,
      email: doctor.email
    },
    process.env.JWT_ACCESS_TOKENS,
    { expiresIn: process.env.JWT_ACCESS_TOKENS_EXPIRY }
  );
};

const generatedoctorRefreshTokens = (doctor, sessionId) => {
  return jwt.sign(
    {
      id: doctor._id,
      sessionId
    },
    process.env.JWT_REFRESH_TOKENS,
    { expiresIn: process.env.JWT_REFRESH_TOKENS_EXPIRY }
  );
};
export {generatedoctorAccessTokens , generatedoctorRefreshTokens};