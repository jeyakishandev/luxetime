const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Tests pour l'authentification
describe('Auth Service Tests', () => {
  
  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test('should compare passwords correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBe(true);
      
      const isNotMatch = await bcrypt.compare('WrongPassword', hashedPassword);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('JWT Token', () => {
    const SECRET = 'test_secret_key';
    
    test('should generate valid JWT token', () => {
      const payload = {
        userId: 1,
        email: 'test@luxetime.fr',
        role: 'CLIENT'
      };
      
      const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    test('should verify JWT token correctly', () => {
      const payload = {
        userId: 1,
        email: 'test@luxetime.fr',
        role: 'CLIENT'
      };
      
      const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
      const decoded = jwt.verify(token, SECRET);
      
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    test('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwt.verify(invalidToken, SECRET);
      }).toThrow();
    });
  });
});

