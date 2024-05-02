const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('./db');
const dbname = require('./dbName');
const _date = require('./date');
var ObjectId = require('mongodb').ObjectId;
var md5 = require('md5');
const jwt = require('jsonwebtoken');
const authentication = require('./authMiddleware');
const constants = require('./constants');
const date = require('./date');

const _dbName = dbname.legal_spi;

/**
 * @swagger
 * /api/legal-spi/save:
 *   post:
 *     summary:
 *     tags: [LegalSPI]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.post(
  '/legal-spi/save',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      let input = req.id;
      if (req.rolename == constants.ROLE_ADMIN) {
        input = req.body.account;
      }
      const batasWaktu = moment(req.body.batas_waktu_perizinan, 'YYYY-MM-DD');
      const today = moment();

      const cuntdown = batasWaktu.diff(today, 'days');

      const data = {
        role: req.body.role,
        account_name: req.body.account_name,
        objek_perizinan: req.body.objek_perizinan,
        area: req.body.area,
        no_izin_pengesahan: req.body.no_izin_pengesahan,
        jml_instalasi: req.body.jml_instalasi,
        pelaksanaan_pemeriksaan: req.body.pelaksanaan_pemeriksaan,
        hasil_pemeriksaan: req.body.hasil_pemeriksaan,
        batas_waktu_perizinan: req.body.batas_waktu_perizinan,
        status_perizinan: cuntdown <= 60 ? 'Tidak Berlaku' : 'Berlaku',
        countdown: cuntdown + ' Hari',
        link_dokumen: req.body.link_dokumen,
        keterangan: req.body.keterangan,
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
 * /api/legal-spi/get:
 *   get:
 *     summary:
 *     tags: [LegalSPI]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/legal-spi/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
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
 * /api/legal-spi/delete/:id:
 *   delete:
 *     summary:
 *     tags: [LegalSPI]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.delete(
  '/legal-spi/delete/:id',
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
 * /api/legal-spi/edit/:id:
 *   delete:
 *     summary:
 *     tags: [LegalSPI]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.put(
  '/legal-spi/edit/:id',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const batasWaktu = moment(req.body.batas_waktu_perizinan, 'YYYY-MM-DD');
      const today = moment();

      const cuntdown = batasWaktu.diff(today, 'days');
      const data = {
        $set: {
          role: req.body.role,
          account_name: req.body.account_name,
          objek_perizinan: req.body.objek_perizinan,
          area: req.body.area,
          no_izin_pengesahan: req.body.no_izin_pengesahan,
          jml_instalasi: req.body.jml_instalasi,
          pelaksanaan_pemeriksaan: req.body.pelaksanaan_pemeriksaan,
          hasil_pemeriksaan: req.body.hasil_pemeriksaan,
          batas_waktu_perizinan: req.body.batas_waktu_perizinan,
          status_perizinan: cuntdown <= 60 ? 'Tidak Berlaku' : 'Berlaku',
          countdown: cuntdown + ' Hari',
          link_dokumen: req.body.link_dokumen,
          keterangan: req.body.keterangan,
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
