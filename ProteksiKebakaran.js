const express = require('express');
const router = express.Router();
const db = require('./db');
const dbname = require('./dbName');
var ObjectId = require('mongodb').ObjectId;
var md5 = require('md5');
const jwt = require('jsonwebtoken');
const authentication = require('./authMiddleware');
const constants = require('./constants');
const date = require('./date');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
const _dbName = dbname.proteksi_kebakaran;
// Multer configuration

/**
 * @swagger
 * /api/proteksi-kebakaran/save:
 *   post:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.post(
  '/proteksi-kebakaran/save',
  authentication(constants.ALL),
  upload.fields([
    { name: 'sertifikat_kepemilikan', maxCount: 1 },
    { name: 'petugas_peran_kebakaran', maxCount: 1 },
    { name: 'regu_penanggulangan_kebakaran', maxCount: 1 },
    { name: 'koord_regu_penanggulangan_kebakaran', maxCount: 1 },
    { name: 'ahli_k3_spesialis_penanggulangan_kebakaran', maxCount: 1 },
    { name: 'identifikasi_bahaya', maxCount: 1 },
    { name: 'struktur_organisasi_tktd', maxCount: 1 },
    { name: 'dokumentasi_sosialisasi', maxCount: 1 },
    { name: 'rekam_data_inspeksi', maxCount: 1 },
    { name: 'dokumen_laporan_simulasi', maxCount: 1 },
    { name: 'jml_karyawan_simulasi', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const sertifikat_kepemilikan =
        req.files['sertifikat_kepemilikan'][0].filename;
      const petugas_peran_kebakaran =
        req.files['petugas_peran_kebakaran'][0].filename;
      const regu_penanggulangan_kebakaran =
        req.files['regu_penanggulangan_kebakaran'][0].filename;
      const koord_regu_penanggulangan_kebakaran =
        req.files['koord_regu_penanggulangan_kebakaran'][0].filename;
      const ahli_k3_spesialis_penanggulangan_kebakaran =
        req.files['ahli_k3_spesialis_penanggulangan_kebakaran'][0].filename;
      const identifikasi_bahaya = req.files['identifikasi_bahaya'][0].filename;
      const struktur_organisasi_tktd =
        req.files['struktur_organisasi_tktd'][0].filename;
      const dokumentasi_sosialisasi =
        req.files['dokumentasi_sosialisasi'][0].filename;
      const rekam_data_inspeksi = req.files['rekam_data_inspeksi'][0].filename;
      const dokumen_laporan_simulasi =
        req.files['dokumen_laporan_simulasi'][0].filename;
      const jml_karyawan_simulasi =
        req.files['jml_karyawan_simulasi'][0].filename;

      const year = parseInt(req.body.year);
      const month = parseInt(req.body.month);

      // Check if data for the given month and year already exists
      const existingData = await db.collection(_dbName).findOne({
        year: year,
        month: month,
        cabang: req.body.cabang,
        site: req.body.site,
        plant: req.body.plant,
      });

      if (existingData) {
        return res.status(400).json({
          result: false,
          error: 'Data for the specified month and year already exists.',
        });
      }

      const data = {
        sertifikat_kepemilikan_file: sertifikat_kepemilikan,
        petugas_peran_kebakaran_file: petugas_peran_kebakaran,
        regu_penanggulangan_kebakaran_file: regu_penanggulangan_kebakaran,
        koord_regu_penanggulangan_kebakaran_file:
          koord_regu_penanggulangan_kebakaran,
        ahli_k3_spesialis_penanggulangan_kebakaran_file:
          ahli_k3_spesialis_penanggulangan_kebakaran,
        identifikasi_bahaya_file: identifikasi_bahaya,
        struktur_organisasi_tktd_file: struktur_organisasi_tktd,
        dokumentasi_sosialisasi_file: dokumentasi_sosialisasi,
        rekam_data_inspeksi_file: rekam_data_inspeksi,
        dokumen_laporan_simulasi_file: dokumen_laporan_simulasi,
        jml_karyawan_simulasi_file: jml_karyawan_simulasi,
        role: req.body.role,
        account_name: req.body.account_name,

        cabang: req.body.cabang,
        site: req.body.site,
        plant: req.body.plant,
        nama_BM_SM: req.body.nama_BM_SM,
        nama_ADH: req.body.nama_ADH,
        nama_ESR_Officer_Leader: req.body.nama_ESR_Officer_Leader,
        nomor_telepon_ESR_Officer_Leader:
          req.body.nomor_telepon_ESR_Officer_Leader,
        nomor_telepon_damkar_setempat: req.body.nomor_telepon_damkar_setempat,
        nomor_Telepon_RS_setempat: req.body.nomor_Telepon_RS_setempat,
        jumlah_karyawan: req.body.jumlah_karyawan,
        luas_tanah_keseluruhan: req.body.luas_tanah_keseluruhan,
        status_kepemilikan_area: req.body.status_kepemilikan_area,

        petugas_peran_kebakaran_jumlah_kesiapan:
          req.body.petugas_peran_kebakaran_jumlah_kesiapan,
        regu_penaggulangan_kebakaran_jumlah_kesiapan:
          req.body.regu_penaggulangan_kebakaran_jumlah_kesiapan,
        koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan:
          req.body.koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan,
        ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan:
          req.body.ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan,

        petugas_peran_kebakaran_jumlah_kecukupan:
          req.body.petugas_peran_kebakaran_jumlah_kecukupan,
        regu_penaggulangan_kebakaran_jumlah_kecukupan:
          req.body.regu_penaggulangan_kebakaran_jumlah_kecukupan,
        koordinator_unit_penanggulangan_kebakaran_jumlah_kecukupan:
          req.body.koordinator_unit_penanggulangan_kebakaran_jumlah_kecukupan,
        ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kecukupan:
          req.body.ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kecukupan,

        ibpr_no: req.body.ibpr_no,
        dokumen_struktur_organisasi_tktd_no:
          req.body.dokumen_struktur_organisasi_tktd_no,
        dokumentasi_sosialisasi_awarreness_no:
          req.body.dokumentasi_sosialisasi_awarreness_no,
        rekam_data_inspeksi_no: req.body.rekam_data_inspeksi_no,
        dokumen_laporan_simulasi_no: req.body.dokumen_laporan_simulasi_no,
        absensi_karyawan_no: req.body.absensi_karyawan_no,

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
      res
        .status(500)
        .json({
          result: false,
          error: 'An error occurred. Please check your data!',
        });
    }
  }
);

/**
 * @swagger
 * /api/proteksi-kebakaran-area/save:
 *   post:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.post(
  '/proteksi-kebakaran-area/save',
  authentication(constants.ALL),
  upload.fields([{ name: 'layout_denah_area', maxCount: 1 }]),
  async (req, res) => {
    try {
      // Check if data for the given month and year already exists
      const existingData = await db
        .collection(dbname.proteksi_kebakaran_area)
        .findOne({
          cabang: req.body.cabang,
          bangunan: req.body.bangunan,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        });

      if (existingData) {
        return res.status(400).json({
          result: false,
          error: 'Data for the specified month and year already exists.',
        });
      }
      const layout_denah_area = req.files['layout_denah_area'][0].filename;

      const data = {
        role: req.body.role,
        account_name: req.body.account_name,
        cabang: req.body.cabang,
        bangunan: req.body.bangunan,
        luas_bangunan: req.body.luas_bangunan,
        status_kepemilikan_area: req.body.status_kepemilikan_area,

        push_button_tersedia: req.body.push_button_tersedia,
        push_button_kecukupan: req.body.push_button_kecukupan,
        push_button_kesiapan: req.body.push_button_kesiapan,

        heat_detector_tersedia: req.body.heat_detector_tersedia,
        heat_detector_kecukupan: req.body.heat_detector_kecukupan,
        heat_detector_kesiapan: req.body.heat_detector_kesiapan,

        smoke_detector_tersedia: req.body.smoke_detector_tersedia,
        smoke_detector_kecukupan: req.body.smoke_detector_kecukupan,
        smoke_detector_kesiapan: req.body.smoke_detector_kesiapan,

        alarm_kebakaran_tersedia: req.body.alarm_kebakaran_tersedia,
        alarm_kebakaran_kecukupan: req.body.alarm_kebakaran_kecukupan,
        alarm_kebakaran_kesiapan: req.body.alarm_kebakaran_kesiapan,

        sprinkler_tersedia: req.body.sprinkler_tersedia,
        sprinkler_kecukupan: req.body.sprinkler_kecukupan,
        sprinkler_kesiapan: req.body.sprinkler_kesiapan,

        apar_AF11_tersedia: req.body.apar_AF11_tersedia,
        apar_AF11_kecukupan: req.body.apar_AF11_kecukupan,
        apar_AF11_kesiapan: req.body.apar_AF11_kesiapan,

        apar_WATER_tersedia: req.body.apar_WATER_tersedia,
        apar_WATER_kecukupan: req.body.apar_WATER_kecukupan,
        apar_WATER_kesiapan: req.body.apar_WATER_kesiapan,

        apar_Foam_AFFF_tersedia: req.body.apar_Foam_AFFF_tersedia,
        apar_Foam_AFFF_kecukupan: req.body.apar_Foam_AFFF_kecukupan,
        apar_Foam_AFFF_kesiapan: req.body.apar_Foam_AFFF_kesiapan,

        apar_Dry_Chemical_Powder_tersedia:
          req.body.apar_Dry_Chemical_Powder_tersedia,
        apar_Dry_Chemical_Powder_kecukupan:
          req.body.apar_Dry_Chemical_Powder_kecukupan,
        apar_Dry_Chemical_Powder_kesiapan:
          req.body.apar_Dry_Chemical_Powder_kesiapan,

        apar_CO2_tersedia: req.body.apar_CO2_tersedia,
        apar_CO2_kecukupan: req.body.apar_CO2_kecukupan,
        apar_CO2_kesiapan: req.body.apar_CO2_kesiapan,

        volume_water_tank_tersedia: req.body.volume_water_tank_tersedia,
        volume_water_tank_kecukupan: req.body.volume_water_tank_kecukupan,
        volume_water_tank_kesiapan: req.body.volume_water_tank_kesiapan,

        hydrant_portable_tersedia: req.body.hydrant_portable_tersedia,
        hydrant_portable_kecukupan: req.body.hydrant_portable_kecukupan,
        hydrant_portable_kesiapan: req.body.hydrant_portable_kesiapan,

        jockey_pump_tersedia: req.body.jockey_pump_tersedia,
        jockey_pump_kecukupan: req.body.jockey_pump_kecukupan,
        jockey_pump_kesiapan: req.body.jockey_pump_kesiapan,

        electric_pump_tersedia: req.body.electric_pump_tersedia,
        electric_pump_kecukupan: req.body.electric_pump_kecukupan,
        electric_pump_kesiapan: req.body.electric_pump_kesiapan,

        diesel_pump_tersedia: req.body.diesel_pump_tersedia,
        diesel_pump_kecukupan: req.body.diesel_pump_kecukupan,
        diesel_pump_kesiapan: req.body.diesel_pump_kesiapan,

        hydrant_dlm_gedung_tersedia: req.body.hydrant_dlm_gedung_tersedia,
        hydrant_dlm_gedung_kecukupan: req.body.hydrant_dlm_gedung_kecukupan,
        hydrant_dlm_gedung_kesiapan: req.body.hydrant_dlm_gedung_kesiapan,

        hydrant_pillar_tersedia: req.body.hydrant_pillar_tersedia,
        hydrant_pillar_kecukupan: req.body.hydrant_pillar_kecukupan,
        hydrant_pillar_kesiapan: req.body.hydrant_pillar_kesiapan,

        hydrant_hoose_25_tersedia: req.body.hydrant_hoose_25_tersedia,
        hydrant_hoose_25_kecukupan: req.body.hydrant_hoose_25_kecukupan,
        hydrant_hoose_25_kesiapan: req.body.hydrant_hoose_25_kesiapan,

        hydrant_hoose_15_tersedia: req.body.hydrant_hoose_15_tersedia,
        hydrant_hoose_15_kecukupan: req.body.hydrant_hoose_15_kecukupan,
        hydrant_hoose_15_kesiapan: req.body.hydrant_hoose_15_kesiapan,

        nozle_25_tersedia: req.body.nozle_25_tersedia,
        nozle_25_kecukupan: req.body.nozle_25_kecukupan,
        nozle_25_kesiapan: req.body.nozle_25_kesiapan,

        nozle_15_tersedia: req.body.nozle_15_tersedia,
        nozle_15_kecukupan: req.body.nozle_15_kecukupan,
        nozle_15_kesiapan: req.body.nozle_15_kesiapan,

        kunci_hydrant_pillar_tersedia: req.body.kunci_hydrant_pillar_tersedia,
        kunci_hydrant_pillar_kecukupan: req.body.kunci_hydrant_pillar_kecukupan,
        kunci_hydrant_pillar_kesiapan: req.body.kunci_hydrant_pillar_kesiapan,

        layout_no: req.body.layout_no,
        layout_denah_area_file: layout_denah_area,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        createddate: date.UTCnowGM7(),
      };
      const query = await db
        .collection(dbname.proteksi_kebakaran_area)
        .insertOne(data);
      res.json({
        result: true,
        message: 'success',
        response: query,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          result: false,
          error: 'An error occurred. Please check your data!',
        });
    }
  }
);

// Define a route for downloading files
router.get('/proteksi-kebakaran-area/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName); // Assuming files are stored in the 'uploads' directory

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers for file download
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/pdf'); // Set the appropriate content type

    // Create a read stream to send the file as the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file doesn't exist, return a 404 error
    res.status(404).send('File not found');
  }
});

/**
 * @swagger
 * /api/proteksi-kebakaran/get:
 *   get:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/proteksi-kebakaran/get',
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
 * /api/proteksi-kebakaran-dashboard/get:
 *   get:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/proteksi-kebakaran-dashboard/get',
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
          cabang: req.query.cabang,
          site: req.query.site,
          plant: req.query.plant,
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

router.get(
  '/proteksi-kebakaran-dash/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      let input = req.id;
      if (req.rolename == constants.ROLE_ADMIN) {
        input = req.query.account;
      }
      const office = await db
        .collection(dbname.proteksi_kebakaran_area)
        .find({
          role: req.query.role,
          cabang: req.query.cabang,
          bangunan: 'office',
          year: parseInt(req.query.year),
          month: parseInt(req.query.month),
        })
        .toArray();
      const workshop = await db
        .collection(dbname.proteksi_kebakaran_area)
        .find({
          role: req.query.role,
          cabang: req.query.cabang,
          bangunan: 'workshop',
          year: parseInt(req.query.year),
          month: parseInt(req.query.month),
        })
        .toArray();
      const warehouse = await db
        .collection(dbname.proteksi_kebakaran_area)
        .find({
          role: req.query.role,
          cabang: req.query.cabang,
          bangunan: 'warehouse',
          year: parseInt(req.query.year),
          month: parseInt(req.query.month),
        })
        .toArray();
      const mess = await db
        .collection(dbname.proteksi_kebakaran_area)
        .find({
          role: req.query.role,
          cabang: req.query.cabang,
          bangunan: 'mess',
          year: parseInt(req.query.year),
          month: parseInt(req.query.month),
        })
        .toArray();

      const query = await db
        .collection(_dbName)
        .find({
          role: req.query.role,
          cabang: req.query.cabang,
          year: parseInt(req.query.year),
          month: parseInt(req.query.month),
        })
        .toArray();
      res.json({
        result: true,
        data: query,
        office,
        workshop,
        warehouse,
        mess,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);

/**
 * @swagger
 * /api/proteksi-kebakaran-dashboard-area/get:
 *   get:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.get(
  '/proteksi-kebakaran-dashboard-area/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      let input = req.id;
      if (req.rolename == constants.ROLE_ADMIN) {
        input = req.query.account;
      }
      let data = null;
      if (req.query.bangunan !== 'all') {
        data = await db
          .collection(dbname.proteksi_kebakaran_area)
          .find({
            role: req.query.role,
            cabang: req.query.cabang,
            bangunan: req.query.bangunan,
            year: parseInt(req.query.year),
            month: parseInt(req.query.month),
          })
          .toArray();
      } else {
        data = await db
          .collection(dbname.proteksi_kebakaran_area)
          .find({
            role: req.query.role,
            cabang: req.query.cabang,
            year: parseInt(req.query.year),
            month: parseInt(req.query.month),
          })
          .toArray();
      }

      res.json({ result: true, data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);

/**
 * @swagger
 * /api/proteksi-kebakaran/delete/:id:
 *   delete:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.delete(
  '/proteksi-kebakaran/delete/:id',
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
 * /api/proteksi-kebakaran/edit/:id:
 *   delete:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.put(
  '/proteksi-kebakaran/edit/:id',
  authentication(constants.ALL),
  upload.fields([
    { name: 'sertifikat_kepemilikan', maxCount: 1 },
    { name: 'petugas_peran_kebakaran', maxCount: 1 },
    { name: 'regu_penanggulangan_kebakaran', maxCount: 1 },
    { name: 'koord_regu_penanggulangan_kebakaran', maxCount: 1 },
    { name: 'ahli_k3_spesialis_penanggulangan_kebakaran', maxCount: 1 },
    { name: 'identifikasi_bahaya', maxCount: 1 },
    { name: 'struktur_organisasi_tktd', maxCount: 1 },
    { name: 'dokumentasi_sosialisasi', maxCount: 1 },
    { name: 'rekam_data_inspeksi', maxCount: 1 },
    { name: 'dokumen_laporan_simulasi', maxCount: 1 },
    { name: 'jml_karyawan_simulasi', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const sertifikat_kepemilikan =
        req.files['sertifikat_kepemilikan'][0].filename;
      const petugas_peran_kebakaran =
        req.files['petugas_peran_kebakaran'][0].filename;
      const regu_penanggulangan_kebakaran =
        req.files['regu_penanggulangan_kebakaran'][0].filename;
      const koord_regu_penanggulangan_kebakaran =
        req.files['koord_regu_penanggulangan_kebakaran'][0].filename;
      const ahli_k3_spesialis_penanggulangan_kebakaran =
        req.files['ahli_k3_spesialis_penanggulangan_kebakaran'][0].filename;
      const identifikasi_bahaya = req.files['identifikasi_bahaya'][0].filename;
      const struktur_organisasi_tktd =
        req.files['struktur_organisasi_tktd'][0].filename;
      const dokumentasi_sosialisasi =
        req.files['dokumentasi_sosialisasi'][0].filename;
      const rekam_data_inspeksi = req.files['rekam_data_inspeksi'][0].filename;
      const dokumen_laporan_simulasi =
        req.files['dokumen_laporan_simulasi'][0].filename;
      const jml_karyawan_simulasi =
        req.files['jml_karyawan_simulasi'][0].filename;
      const data = {
        $set: {
          sertifikat_kepemilikan_file: sertifikat_kepemilikan,
          petugas_peran_kebakaran_file: petugas_peran_kebakaran,
          regu_penanggulangan_kebakaran_file: regu_penanggulangan_kebakaran,
          koord_regu_penanggulangan_kebakaran_file:
            koord_regu_penanggulangan_kebakaran,
          ahli_k3_spesialis_penanggulangan_kebakaran_file:
            ahli_k3_spesialis_penanggulangan_kebakaran,
          identifikasi_bahaya_file: identifikasi_bahaya,
          struktur_organisasi_tktd_file: struktur_organisasi_tktd,
          dokumentasi_sosialisasi_file: dokumentasi_sosialisasi,
          rekam_data_inspeksi_file: rekam_data_inspeksi,
          dokumen_laporan_simulasi_file: dokumen_laporan_simulasi,
          jml_karyawan_simulasi_file: jml_karyawan_simulasi,
          role: req.body.role,
          account_name: req.body.account_name,

          cabang: req.body.cabang,
          site: req.body.site,
          plant: req.body.plant,
          nama_BM_SM: req.body.nama_BM_SM,
          nama_ADH: req.body.nama_ADH,
          nama_ESR_Officer_Leader: req.body.nama_ESR_Officer_Leader,
          nomor_telepon_ESR_Officer_Leader:
            req.body.nomor_telepon_ESR_Officer_Leader,
          nomor_telepon_damkar_setempat: req.body.nomor_telepon_damkar_setempat,
          nomor_Telepon_RS_setempat: req.body.nomor_Telepon_RS_setempat,
          jumlah_karyawan: req.body.jumlah_karyawan,
          luas_tanah_keseluruhan: req.body.luas_tanah_keseluruhan,
          status_kepemilikan_area: req.body.status_kepemilikan_area,

          petugas_peran_kebakaran_jumlah_kesiapan:
            req.body.petugas_peran_kebakaran_jumlah_kesiapan,
          regu_penaggulangan_kebakaran_jumlah_kesiapan:
            req.body.regu_penaggulangan_kebakaran_jumlah_kesiapan,
          koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan:
            req.body.koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan,
          ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan:
            req.body.ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan,

          petugas_peran_kebakaran_jumlah_kecukupan:
            req.body.petugas_peran_kebakaran_jumlah_kecukupan,
          regu_penaggulangan_kebakaran_jumlah_kecukupan:
            req.body.regu_penaggulangan_kebakaran_jumlah_kecukupan,
          koordinator_unit_penanggulangan_kebakaran_jumlah_kecukupan:
            req.body.koordinator_unit_penanggulangan_kebakaran_jumlah_kecukupan,
          ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kecukupan:
            req.body
              .ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kecukupan,

          ibpr_no: req.body.ibpr_no,
          dokumen_struktur_organisasi_tktd_no:
            req.body.dokumen_struktur_organisasi_tktd_no,
          dokumentasi_sosialisasi_awarreness_no:
            req.body.dokumentasi_sosialisasi_awarreness_no,
          rekam_data_inspeksi_no: req.body.rekam_data_inspeksi_no,
          dokumen_laporan_simulasi_no: req.body.dokumen_laporan_simulasi_no,
          absensi_karyawan_no: req.body.absensi_karyawan_no,

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
      res
        .status(500)
        .json({
          result: false,
          error: 'An error occurred. Please check your data!',
        });
    }
  }
);

/**
 * @swagger
 * /api/proteksi-kebakaran-area/edit/:id:
 *   delete:
 *     summary:
 *     tags: [ProteksiKebakaran]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: ''
 */
router.put(
  '/proteksi-kebakaran-area/edit/:id',
  authentication(constants.ALL),
  upload.fields([{ name: 'layout_denah_area', maxCount: 1 }]),
  async (req, res) => {
    try {
      const layout_denah_area = req.files['layout_denah_area'][0].filename;
      const data = {
        $set: {
          role: req.body.role,
          account_name: req.body.account_name,
          cabang: req.body.cabang,
          luas_bangunan: req.body.luas_bangunan,
          status_kepemilikan_area: req.body.status_kepemilikan_area,

          push_button_tersedia: req.body.push_button_tersedia,
          push_button_kecukupan: req.body.push_button_kecukupan,
          push_button_kesiapan: req.body.push_button_kesiapan,

          heat_detector_tersedia: req.body.heat_detector_tersedia,
          heat_detector_kecukupan: req.body.heat_detector_kecukupan,
          heat_detector_kesiapan: req.body.heat_detector_kesiapan,

          smoke_detector_tersedia: req.body.heat_detector_tersedia,
          smoke_detector_kecukupan: req.body.heat_detector_kecukupan,
          smoke_detector_kesiapan: req.body.heat_detector_kesiapan,

          alarm_kebakaran_tersedia: req.body.flame_detector_tersedia,
          alarm_kebakaran_kecukupan: req.body.flame_detector_kecukupan,
          alarm_kebakaran_kesiapan: req.body.flame_detector_kesiapan,

          sprinkler_tersedia: req.body.sprinkler_tersedia,
          sprinkler_kecukupan: req.body.sprinkler_kecukupan,
          sprinkler_kesiapan: req.body.sprinkler_kesiapan,

          apar_AF11_tersedia: req.body.apar_AF11_tersedia,
          apar_AF11_kecukupan: req.body.apar_AF11_kecukupan,
          apar_AF11_kesiapan: req.body.apar_AF11_kesiapan,

          apar_WATER_tersedia: req.body.apar_WATER_tersedia,
          apar_WATER_kecukupan: req.body.apar_WATER_kecukupan,
          apar_WATER_kesiapan: req.body.apar_WATER_kesiapan,

          apar_Foam_AFFF_tersedia: req.body.apar_Foam_AFFF_tersedia,
          apar_Foam_AFFF_kecukupan: req.body.apar_Foam_AFFF_kecukupan,
          apar_Foam_AFFF_kesiapan: req.body.apar_Foam_AFFF_kesiapan,

          apar_Dry_Chemical_Powder_tersedia:
            req.body.apar_Dry_Chemical_Powder_tersedia,
          apar_Dry_Chemical_Powder_kecukupan:
            req.body.apar_Dry_Chemical_Powder_kecukupan,
          apar_Dry_Chemical_Powder_kesiapan:
            req.body.apar_Dry_Chemical_Powder_kesiapan,

          apar_CO2_tersedia: req.body.apar_CO2_tersedia,
          apar_CO2_kecukupan: req.body.apar_CO2_kecukupan,
          apar_CO2_kesiapan: req.body.apar_CO2_kesiapan,

          volume_water_tank_tersedia: req.body.volume_water_tank_tersedia,
          volume_water_tank_kecukupan: req.body.volume_water_tank_kecukupan,
          volume_water_tank_kesiapan: req.body.volume_water_tank_kesiapan,

          hydrant_portable_tersedia: req.body.hydrant_portable_tersedia,
          hydrant_portable_kecukupan: req.body.hydrant_portable_kecukupan,
          hydrant_portable_kesiapan: req.body.hydrant_portable_kesiapan,

          jockey_pump_tersedia: req.body.jockey_pump_tersedia,
          jockey_pump_kecukupan: req.body.jockey_pump_kecukupan,
          jockey_pump_kesiapan: req.body.jockey_pump_kesiapan,

          electric_pump_tersedia: req.body.electric_pump_tersedia,
          electric_pump_kecukupan: req.body.electric_pump_kecukupan,
          electric_pump_kesiapan: req.body.electric_pump_kesiapan,

          diesel_pump_tersedia: req.body.diesel_pump_tersedia,
          diesel_pump_kecukupan: req.body.diesel_pump_kecukupan,
          diesel_pump_kesiapan: req.body.diesel_pump_kesiapan,

          hydrant_dlm_gedung_tersedia: req.body.hydrant_dlm_gedung_tersedia,
          hydrant_dlm_gedung_kecukupan: req.body.hydrant_dlm_gedung_kecukupan,
          hydrant_dlm_gedung_kesiapan: req.body.hydrant_dlm_gedung_kesiapan,

          hydrant_pillar_tersedia: req.body.hydrant_pillar_tersedia,
          hydrant_pillar_kecukupan: req.body.hydrant_pillar_kecukupan,
          hydrant_pillar_kesiapan: req.body.hydrant_pillar_kesiapan,

          hydrant_hoose_25_tersedia: req.body.hydrant_hoose_25_tersedia,
          hydrant_hoose_25_kecukupan: req.body.hydrant_hoose_25_kecukupan,
          hydrant_hoose_25_kesiapan: req.body.hydrant_hoose_25_kesiapan,

          hydrant_hoose_15_tersedia: req.body.hydrant_hoose_15_tersedia,
          hydrant_hoose_15_kecukupan: req.body.hydrant_hoose_15_kecukupan,
          hydrant_hoose_15_kesiapan: req.body.hydrant_hoose_15_kesiapan,

          nozle_25_tersedia: req.body.nozle_25_tersedia,
          nozle_25_kecukupan: req.body.nozle_25_kecukupan,
          nozle_25_kesiapan: req.body.nozle_25_kesiapan,

          nozle_15_tersedia: req.body.nozle_15_tersedia,
          nozle_15_kecukupan: req.body.nozle_15_kecukupan,
          nozle_15_kesiapan: req.body.nozle_15_kesiapan,

          kunci_hydrant_pillar_tersedia: req.body.kunci_hydrant_pillar_tersedia,
          kunci_hydrant_pillar_kecukupan:
            req.body.kunci_hydrant_pillar_kecukupan,
          kunci_hydrant_pillar_kesiapan: req.body.kunci_hydrant_pillar_kesiapan,

          layout_no: req.body.layout_no,
          layout_denah_area_file: layout_denah_area,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          createddate: date.UTCnowGM7(),
        },
      };

      const query = await db
        .collection(dbname.proteksi_kebakaran_area)
        .updateOne({ _id: new ObjectId(req.params.id) }, data);
      res.json({ result: true, message: 'success', response: query });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          result: false,
          error: 'An error occurred. Please check your data!',
        });
    }
  }
);

/**
 * @swagger
 * /api/master-cabang/get:
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
  '/master-cabang/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const query = await db
        .collection(_dbName)
        .aggregate([
          {
            $group: {
              _id: '$cabang',
            },
          },
        ])
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
 * /api/master-plant/get:
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
  '/master-plant/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const query = await db
        .collection(_dbName)
        .aggregate([
          {
            $group: {
              _id: '$plant',
            },
          },
        ])
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
 * /api/master-site/get:
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
  '/master-site/get',
  authentication(constants.ALL),
  async (req, res) => {
    try {
      const query = await db
        .collection(_dbName)
        .aggregate([
          {
            $group: {
              _id: '$site',
            },
          },
        ])
        .toArray();
      res.json({ result: true, data: query });
    } catch (error) {
      console.log(error);
      res.status(500).json({ result: false });
    }
  }
);
module.exports = router;
