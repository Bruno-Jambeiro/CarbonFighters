/**
 * A5 Evaluation - Criteria applied in this file
 * - Equivalence Class Partitioning: cases missing each password requirement
 *   (uppercase, lowercase, digit, special char) and invalid email formats.
 * - Boundary Value Analysis: password length (7 vs 8) and email TLD (1 vs 2 characters).
 * Unit: validation utils (validatePasswordStrength, validateEmailFormat).
 */

import { validatePasswordStrength, validateEmailFormat } from '../../src/utils/validations.utils';

describe('Password Validation - Equivalence Partitions & Boundary Values', () => {
  const validBase = 'Aa1!aaaa';
  test('Valid password passes (boundary length 8)', () => {
    expect(validatePasswordStrength(validBase)).toHaveLength(0);
  });
  test('Length 7 fails', () => {
    expect(validatePasswordStrength('Aa1!aaa')).toContain('Password must be at least 8 characters long');
  });
  test('Missing uppercase', () => {
    expect(validatePasswordStrength('aa1!aaaa')).toContain('Password must contain at least one uppercase letter');
  });
  test('Missing lowercase', () => {
    expect(validatePasswordStrength('AA1!AAAA')).toContain('Password must contain at least one lowercase letter');
  });
  test('Missing digit', () => {
    expect(validatePasswordStrength('AAa!aaaa')).toContain('Password must contain at least one digit');
  });
  test('Missing special char', () => {
    expect(validatePasswordStrength('AAa1aaaa')).toContain('Password must contain at least one special character');
  });
  test('Multiple issues accumulate', () => {
    const errors = validatePasswordStrength('short');
    expect(errors.length).toBeGreaterThan(1);
  });
});

describe('Email Validation - Equivalence & Boundary', () => {
  test('Valid email passes', () => {
    expect(validateEmailFormat('user@example.com')).toBeNull();
  });
  test('Missing @ fails', () => {
    expect(validateEmailFormat('userexample.com')).toBe('Invalid email format');
  });
  test('Missing dot in domain fails', () => {
    expect(validateEmailFormat('user@example')).toBe('Invalid email format');
  });
  test('Boundary TLD length 1 fails', () => {
    expect(validateEmailFormat('user@example.c')).toBe('Invalid email format');
  });
  test('Boundary TLD length 2 passes', () => {
    expect(validateEmailFormat('user@example.co')).toBeNull();
  });
});
