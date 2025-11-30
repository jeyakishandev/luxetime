const CertificateService = require('../services/certificateService');

class CertificateController {
  // Créer un certificat pour un item de commande
  static async createCertificate(req, res) {
    try {
      const { commandeItemId } = req.body;
      const result = await CertificateService.createCertificate(commandeItemId, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer les certificats de l'utilisateur
  static async getUserCertificates(req, res) {
    try {
      const result = await CertificateService.getUserCertificates(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Vérifier un certificat (public)
  static async verifyCertificate(req, res) {
    try {
      const { numeroCertificat } = req.params;
      const result = await CertificateService.verifyCertificate(numeroCertificat);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer un certificat par numéro
  static async getCertificateByNumber(req, res) {
    try {
      const { numeroCertificat } = req.params;
      const result = await CertificateService.getCertificateByNumber(numeroCertificat);
      res.json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = CertificateController;

