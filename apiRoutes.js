const express = require('express');
const proteksikebakaran = require('./ProteksiKebakaran');
const login = require('./Login');
const legalSPI = require('./LegalSPI');
const formEvalProteksiKebakaran = require('./FormEvalProteksiKebakaran');
const admin = require('./Admin');

const router = express.Router();

router.use('/api', [
  login,
  proteksikebakaran,
  legalSPI,
  formEvalProteksiKebakaran,
  admin,
]);

module.exports = router;
