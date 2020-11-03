const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const ejs = require('ejs');
const db = require('./db');
const app = express();
const morgan = require('morgan');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

function isLoggedOn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.warn('not logged in so redirecting!');
  res.redirect('/login');
}

// Configure the local strategy for use by Passport.
passport.use(
  new Strategy(function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        return cb(err, null);
      }
      if (!user || user.password != password) {
        return cb(null, null);
      }
      return cb(null, user);
    });
  }),
);

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

// Configure view engine
app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);
app.set('views', __dirname + '/views');

// middlewares
// parse application/x-www-form-urlencoded
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }),
);

//Init Passport
app.use(passport.initialize());
app.use(passport.session());

// parse application/json
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// configure routes
app.get('/', function (req, res) {
  res.render('home', { user: req.user });
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  },
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/profile', isLoggedOn, function (req, res) {
  res.render('profile', { user: req.user });
});

app.listen(port, () => {
  console.log(`Trail Finder is listening on port http://localhost:${port}`);
});
