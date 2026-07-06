import jwt from "jsonwebtoken";

const generatepatientAccessTokens = (patient) => {
  return jwt.sign(
    {
      id: patient._id,     
      role: patient.role,
      email: patient.email
    },
    process.env.JWT_ACCESS_TOKENS,
    { expiresIn: process.env.JWT_ACCESS_TOKENS_EXPIRY }
  );
};

const generatepatientRefreshTokens = (patient, sessionId) => {
  return jwt.sign(
    {
      id: patient._id,
      sessionId
    },
    process.env.JWT_REFRESH_TOKENS,
    { expiresIn: process.env.JWT_REFRESH_TOKENS_EXPIRY }
  );
};
export {generatepatientAccessTokens , generatepatientRefreshTokens};