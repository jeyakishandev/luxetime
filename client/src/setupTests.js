// Configuration pour les tests
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Nettoyage après chaque test
afterEach(() => {
  cleanup();
});

