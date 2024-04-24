const jwt = require('jsonwebtoken');
const db = require('./db');
const dbname = require('./dbname');
const constants = require('./constants');
var md5 = require('md5');

const authentication = (role = '') => {
  return (req, res, next) => {
    try {
      let token = req.headers['authorization'];
      token = token.split(' ')[1];

      if (token == null) return res.sendStatus(401);

      jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(401);
        var query = await db
          .collection(dbname.account)
          .findOne({ user: user.user, token: token });
        if (query != undefined) {
          req.id = query._id + '';
          req.rolename = query.rolename;
          if (
            req.rolename == role ||
            req.rolename == constants.ROLE_ADMIN ||
            role == constants.ALL
          ) {
            next();
          } else {
            return res.sendStatus(403);
          }
        } else {
          return res.sendStatus(401);
        }
      });
    } catch (error) {
      return res.sendStatus(401);
    }
  };
};

module.exports = authentication;
