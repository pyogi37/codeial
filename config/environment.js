const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_log");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  assest_path: "./assets",
  session_cookie_key: "blahblah",
  db: "codeial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "pyogi37@gmail.com",
      pass: "izntpbaoarlpzxfg",
    },
  },
  google_client_id:
    "403823892185-hrneb574n7aqko65ane8f5t75qnc7j92.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://54.227.116.54:8000/users/auth/google/callback",
  jwt_secrert: "codeial",
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};

const production = {
  name: "production",
  assest_path: process.env.CODEIAL_ASSETS_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PWD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secrert: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports = development;
