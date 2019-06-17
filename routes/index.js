/* eslint-disable no-unused-vars */
const express = require('express');
const jwt = require('jsonwebtoken');
const bkdf2Password = require('pbkdf2-password');
const alert = require('alert-node');

const { User } = require('../models');

const hasher = bkdf2Password();
const router = express.Router();

// router.get('/', (req, res) => {
//   res.sendFile('../views/index.html');
// });

router.post('/register', (req, res) => {
  const { email, nick, password } = req.body;
  hasher({ password }, (err, pass, salt, hash) => {
    User.create({
      nick,
      email,
      password: hash,
      salt,
    }).then((result) => {
      alert('회원가입 성공');
    }).catch((error) => {
      console.log(error);
    });
  });
});

router.post('/login', (req, res) => {
  const { email, nick, password } = req.body;
  User.findOne(
    { where: { email } },
  ).then((result) => {
    const dbPassword = result.dataValues.password;
    const salt = result.dataValues.salt;

    const hashPassword = hasher({ password, salt: result.salt }, (err, pass, salt, hash) => {
      if (dbPassword === hash) {
        alert('로그인 성공, 토큰 발급');
        const user = {
          nick,
          email,
          hash,
        };
        jwt.sign({ user }, 'serectkey', { expiresIn: '20s' }, (err, token) => {
          res.json({
            token,
          });
        });
      } else {
        console.log('비밀번호 불일치');
        alert('비밀번호 불일치');
      }
    });
  })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/jwt', verifyToken, (req, res) => {
  jwt.verify(req.headers.token, 'serectkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        messsage: 'Post created...',
        authData,
      });
    }
  });
});


function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
