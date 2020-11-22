import express from 'express';
import bodyParser from 'body-parser';
import { Strategy } from 'passport-local';
import ejs from 'ejs';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import * as users from '../controllers/users';

function configurePassport() {
  // Configure the local strategy for use by Passport.
  passport.use(
    new Strategy(function (username, password, cb) {
      users.findByUsername(username, function (err, user) {
        if (err) {
          return cb(err, null);
        }
        if (!user || user.password !== password) {
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
    users.findById(id, function (err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
}

export function isLoggedOn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.warn('not logged in so redirecting!');
  res.redirect('/login');
}

export function addMiddlewares(app) {
  configurePassport();

  // Configure view engine
  app.set('view engine', 'ejs');
  app.engine('ejs', ejs.__express);
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));

  // middlewares
  // parse application/x-www-form-urlencoded
  app.use(morgan('combined'));
  app.use(bodyParser.urlencoded({ extended: true }));
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
}
