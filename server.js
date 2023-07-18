const express = require('express');
const path = require('path');
const app = express();
app.use(helmet.contentSecurityPolicy());
const allowedOrigins = ['https://dungnguyen69.github.io/Frontend-DeviceManagement'];
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true) 
      } else {
        callback(new Error(`Origin: ${origin} is now allowed`))
      }
    }
  }));

const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
};
// Serve only the static files form the dist directory
app.use(express.static('./dist/Frontend-DeviceManagement'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/Frontend-DeviceManagement/index.html'));
});

app.get('/*', (req, res) =>
    res.sendFile('index.html', { root: 'dist/angular-heroku/' }),
);
app.use(forceSSL());
app.listen(process.env.PORT || 8080);