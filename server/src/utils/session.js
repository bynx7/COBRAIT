const jwt = require("jsonwebtoken");
const config = require("../config");

function signSessionToken(user) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    config.jwtSecret,
    {
      subject: user.id,
      expiresIn: config.jwtExpiresIn
    }
  );
}

function verifySessionToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: config.sessionCookieSecure,
    path: "/",
    maxAge: config.sessionMaxAgeHours * 60 * 60 * 1000
  };
}

function setSessionCookie(response, token) {
  response.cookie(config.sessionCookieName, token, getCookieOptions());
}

function clearSessionCookie(response) {
  response.clearCookie(config.sessionCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.sessionCookieSecure,
    path: "/"
  });
}

module.exports = {
  clearSessionCookie,
  setSessionCookie,
  signSessionToken,
  verifySessionToken
};

