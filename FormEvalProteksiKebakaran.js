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

const _dbName = dbname.form_eval_proteksi_kebakaran;

/**
 * @swagger
 * /api/form-eval-proteksi-kebakaran/save:
 *   post:
 *     summary:
 *     tags: [FormEvalProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.post(
  '/form-eval-proteksi-kebakaran/save',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const data = {
        role: req.body.role,
        account_name: req.body.account_name,
        dept: req.body.dept,
        keterangan: req.body.keterangan,
        problem_identification: req.body.problem_identification,
        root_cause: req.body.root_cause,
        corrective_action: req.body.corrective_action,
        preventive_action: req.body.preventive_action,
        dead_line: req.body.dead_line,
        pic: req.body.pic,
        status: req.body.status,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        createddate: date.UTCnowGM7(),
      };
      const query = await db.collection(_dbName).insertOne(data);
      res.json({
        result: true,
        message: 'success',
        response: query,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        result: false,
        error: 'An error occurred. Please check your data!',
      });
    }
  }
);

/**
 * @swagger
 * /api/form-eval-proteksi-kebakaran/get:
 *   get:
 *     summary:
 *     tags: [FormEvalProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/form-eval-proteksi-kebakaran/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      let input = req.id;
      if (req.rolename == constants.ROLE_ADMIN) {
        input = req.query.account;
      }
      const query = await db
        .collection(_dbName)
        .find({
          role: req.query.role,
          account_name: req.query.account_name,
          year: parseInt(req.query.year),
          month: parseInt(req.query.month),
        })
        .toArray();
      res.json({ result: true, data: query });
    } catch (error) {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);

/**
 * @swagger
 * /api/form-eval-proteksi-kebakaran/delete/:id:
 *   delete:
 *     summary:
 *     tags: [FormEvalProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.delete(
  '/form-eval-proteksi-kebakaran/delete/:id',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const query = await db
        .collection(_dbName)
        .deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ result: true, message: 'success' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);

/**
 * @swagger
 * /api/form-eval-proteksi-kebakaran/edit/:id:
 *   delete:
 *     summary:
 *     tags: [FormEvalProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.put(
  '/form-eval-proteksi-kebakaran/edit/:id',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const data = {
        $set: {
          dept: req.body.dept,
          keterangan: req.body.keterangan,
          problem_identification: req.body.problem_identification,
          root_cause: req.body.root_cause,
          corrective_action: req.body.corrective_action,
          preventive_action: req.body.preventive_action,
          dead_line: req.body.dead_line,
          pic: req.body.pic,
          status: req.body.status,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          createddate: date.UTCnowGM7(),
        },
      };
      const query = await db
        .collection(_dbName)
        .updateOne({ _id: new ObjectId(req.params.id) }, data);
      res.json({ result: true, message: 'success', response: query });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        result: false,
        error: 'An error occurred. Please check your data!',
      });
    }
  }
);

module.exports = router;
