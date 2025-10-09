import { describe, test, expect } from 'vitest';

// Tests pour les fonctions utilitaires
describe('Utility Functions Tests', () => {
  
  describe('Price Formatting', () => {
    test('should format price correctly', () => {
      const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(price);
      };

      expect(formatPrice(1299)).toBe('1 299,00 €');
      expect(formatPrice(99.99)).toBe('99,99 €');
    });
  });

  describe('Email Validation', () => {
    test('should validate email format', () => {
      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@luxetime.fr')).toBe(true);
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('no@domain')).toBe(false);
    });
  });

  describe('Date Formatting', () => {
    test('should format date to French format', () => {
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
      };

      const testDate = '2024-10-09';
      const formatted = formatDate(testDate);
      
      expect(formatted).toContain('/');
      expect(typeof formatted).toBe('string');
    });
  });
});

