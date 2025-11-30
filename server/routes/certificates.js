const express = require('express');
const router = express.Router();
const CertificateController = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');

// Routes publiques
router.get('/verify/:numeroCertificat', CertificateController.verifyCertificate);
router.get('/:numeroCertificat', CertificateController.getCertificateByNumber);

// Routes authentifiées
router.use(authenticateToken);
router.post('/', CertificateController.createCertificate);
router.get('/user/my-certificates', CertificateController.getUserCertificates);

module.exports = router;

