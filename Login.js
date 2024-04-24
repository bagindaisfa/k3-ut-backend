const express = require('express');
const router = express.Router();
const db = require('./db');
const dbname = require('./dbName');
const _date = require('./date');
var ObjectId = require('mongodb').ObjectId;
var md5 = require('md5');
const jwt = require('jsonwebtoken');
const authentication = require('./authMiddleware');
const constants = require('./constants');

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Returns a sample message
 *     tags: [Other]
 *     description: Returns a sample message from the server
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: 'This is a sample message'
 */
router.post('/login', async (req, res) => {
  try {
    const user = req.body.username;
    const pass = req.body.password;
    const where = {
      username: user,
      password: md5(pass),
    };
    const dataJwt = {
      username: user,
      loginAt: new Date(),
    };
    const query = await db.collection(dbname.account).findOne(where);
    if (query != null || query != undefined) {
      const token = jwt.sign(
        dataJwt,
        'iwiqowqo39283983jskjdksdsk3u2328329sdnsmncmndsmjherheHHKdksdksjdqiqi',
        {
          expiresIn: '1d',
        }
      );
      await db
        .collection(dbname.account)
        .updateOne(where, { $set: { token: token, last_update: new Date() } });
      res.status(200).json({
        result: true,
        token: token,
        rolename: query.rolename,
        name: query.name,
      });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, message: error });
  }
});

module.exports = router;
