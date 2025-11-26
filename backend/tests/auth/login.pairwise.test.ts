/**
 * A5 Evaluation - Criteria applied in this file
 * - Pairwise: covers combinations of (identifierType × formatValidity × existence × passwordCorrect)
 *   using a pairwise reduction to avoid combinatorial explosion.
 * Unit: authentication endpoint (/auth/login).
 */

import request from 'supertest';
import app from '../../src/app';

// Simple pairwise reduction ensuring each pair appears at least once
function pairwise(params: Record<string, string[]>) {
  const keys = Object.keys(params);
  const all: any[] = [];
  const backtrack = (i: number, acc: any) => {
    if (i === keys.length) { all.push({ ...acc }); return; }
    for (const v of params[keys[i]]) { acc[keys[i]] = v; backtrack(i+1, acc); }
  }; backtrack(0, {});
  const requiredPairs = new Set<string>();
  const selected: any[] = [];
  for (const c of all) {
    let contributes = false;
    for (let i=0;i<keys.length;i++) {
      for (let j=i+1;j<keys.length;j++) {
        const tag = `${keys[i]}=${c[keys[i]]}|${keys[j]}=${c[keys[j]]}`;
        if (!requiredPairs.has(tag)) { requiredPairs.add(tag); contributes = true; }
      }
    }
    if (contributes) selected.push(c);
  }
  return selected;
}

describe('Login Pairwise Interaction Coverage', () => {
  const basePassword = 'StrongPwd@9';
  // Create two users: one email only, one cpf only
  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      firstName: 'Email', lastName: 'User', cpf: '12345678901', email: 'email.user@test.com', password: basePassword
    });
    await request(app).post('/auth/register').send({
      firstName: 'Cpf', lastName: 'User', cpf: '98765432109', password: basePassword
    });
  });

  const params = {
    identifierType: ['email','cpf'],
    formatValidity: ['valid','invalid'],
    existence: ['exists','absent'],
    passwordCorrect: ['yes','no']
  };

  const scenarios = pairwise(params);

  test.each(scenarios)("Scenario %# %o", async (s) => {
    const body: any = { password: s.passwordCorrect === 'yes' ? basePassword : 'WrongPwd@1' };
    if (s.identifierType === 'email') {
      if (s.existence === 'exists') body.email = s.formatValidity === 'valid' ? 'email.user@test.com' : 'email.usertest.com';
      else body.email = s.formatValidity === 'valid' ? 'ghost@test.com' : 'ghosttest.com';
    } else { // cpf
      if (s.existence === 'exists') body.cpf = s.formatValidity === 'valid' ? '98765432109' : '9876543210';
      else body.cpf = s.formatValidity === 'valid' ? '11122233344' : '1112223334';
    }

    const res = await request(app).post('/auth/login').send(body);
    const shouldSucceed = s.formatValidity === 'valid' && s.existence === 'exists' && s.passwordCorrect === 'yes';
    if (shouldSucceed) {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    } else {
      expect([400,401]).toContain(res.status);
    }
  });
});
