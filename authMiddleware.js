const jwt = require('jsonwebtoken');
const db = require('./db');
const dbname = require('./dbName');
const constants = require('./constants');
var md5 = require('md5');

const authentication = (role = '') => {
  return (req, res, next) => {
    try {
      let token = req.headers['authorization'];
      token = token.split(' ')[1];

      if (token == null) return res.sendStatus(401);

      jwt.verify(
        token,
        'iwiqowqo39283983jskjdksdsk3u2328329sdnsmncmndsmjherheHHKdksdksjdqiqi',
        async (err, user) => {
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
        }
      );
    } catch (error) {
      return res.sendStatus(401);
    }
  };
};

module.exports = authentication;
