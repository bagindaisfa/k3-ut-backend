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
const date = require('./date');

/**
 * @swagger
 * /api/admin/create_account:
 *   post:
 *     summary:
 *     tags: [Admin]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - username
 *              - password
 *              - rolename
 *            properties:
 *              name:
 *                type: string
 *                default: string
 *              username:
 *                type: string
 *                default: string
 *              password:
 *                type: string
 *                default: string
 *              rolename:
 *                type: string
 *                default: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.post(
  '/admin/create_account',
  authentication(constants.ROLE_ADMIN),
  async (req, res) => {
    try {
      var data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password),
        rolename: req.body.rolename,
        attribute: req.body.attribute,
        createdate: date.UTCnowGM7(),
      };
      let cekusername = await db
        .collection(dbname.account)
        .find({ username: req.body.username })
        .toArray();
      if (cekusername.length == 0) {
        await db.collection(dbname.account).insertOne(data);
        res.json({ result: true, message: 'success' });
      } else {
        res.status(500).send({ result: false });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

/**
 * @swagger
 * /api/admin/edit_account/:id:
 *   put:
 *     summary:
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.put(
  '/admin/edit_account/:id',
  authentication(constants.ROLE_ADMIN),
  async (req, res) => {
    try {
      let cek = await db
        .collection(dbname.account)
        .find({ _id: new ObjectId(req.params.id) })
        .toArray();
      if (cek.length > 0) {
        var data = {};
        if (req.body.editpassword == true) {
          data = {
            $set: {
              name: req.body.name,
              username: req.body.username,
              rolename: req.body.rolename,
              password: md5(req.body.password),
              attribute: req.body.attribute,
              updatedate: date.UTCnowGM7(),
            },
          };
        } else {
          data = {
            $set: {
              name: req.body.name,
              username: req.body.username,
              rolename: req.body.rolename,
              attribute: req.body.attribute,
              updatedate: date.UTCnowGM7(),
            },
          };
        }

        let query = await db
          .collection(dbname.account)
          .updateOne({ _id: new ObjectId(req.params.id) }, data);

        res.json({ result: true, message: 'success' });
      } else {
        res.status(500).json({ result: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);

/**
 * @swagger
 * /api/admin/get_account:
 *   get:
 *     summary:
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/admin/get_account',
  authentication(constants.ROLE_ADMIN),
  async (req, res) => {
    try {
      const data = await db
        .collection(dbname.account)
        .aggregate([
          {
            $match: {},
          },
          {
            $addFields: {
              createdDate: {
                $dateToString: {
                  format: '%d-%m-%Y %H:%M', // Format tanggal yang diinginkan
                  date: '$createdate',
                },
              },
            },
          },
          {
            $project: {
              password: 0,
              token: 0,
            },
          },
        ])
        .toArray();
      res.status(200).json({ result: true, data: data });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

/**
 * @swagger
 * /api/admin/delete_account:
 *   delete:
 *     summary:
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.delete(
  '/admin/delete_account/:id',
  authentication(constants.ROLE_ADMIN),
  async (req, res) => {
    try {
      const query = await db
        .collection(dbname.account)
        .deleteOne({ _id: new ObjectId(req.params.id) });
      res.status(200).json({ result: true });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

/**
 * @swagger
 * /api/admin/get_cabang:
 *   get:
 *     summary:
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/admin/get_cabang',
  authentication(constants.ROLE_ADMIN),
  async (req, res) => {
    try {
      const query = await db
        .collection(dbname.account)
        .find({ rolename: constants.ROLE_CABANG })
        .toArray();
      res.status(200).json({ result: true, data: query });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

module.exports = router;
