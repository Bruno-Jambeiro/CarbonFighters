/**
 * A5 Evaluation - Criteria applied in this file
 * - Equivalence Class Partitioning: actions below/at/above the threshold (10) and streak below/at the threshold (7).
 * - Boundary Value Analysis: checks at 9/10/11 actions and 6/7 streak.
 * Unit: badges service (checkAndAwardBadges) using data in the activities table.
 */

import { dbRun, dbGet } from '../../src/services/db.service';
import { checkAndAwardBadges } from '../../src/services/badge.service';

/**
 * Tests badge awarding using Equivalence Partitions & Boundary Value Analysis
 * - Actions count milestone badge (requirement 10)
 * - Streak badge (requirement 7)
 */
describe('Badge Awarding - Partitions & Boundaries', () => {
  let userId: number;
  beforeAll(async () => {
    // Create user
    await dbRun(`INSERT INTO users (firstName,lastName,cpf,password) VALUES ('Badge','Tester','55566677788','hashed')`);
    const user = await dbGet<{id: number}>(`SELECT id FROM users WHERE cpf = '55566677788'`);
    userId = user!.id;
    // Seed minimal badges needed
    await dbRun(`INSERT OR IGNORE INTO badges (name, description, type, icon, requirement, requirement_type, points) VALUES ('Primeiro Passo','10 ações','milestone','🏁',10,'actions_count',10)`);
    await dbRun(`INSERT OR IGNORE INTO badges (name, description, type, icon, requirement, requirement_type, points) VALUES ('7 Dias de Fogo','7 dias de streak','streak','🔥',7,'streak_days',70)`);
  });
  async function getEarnedBadgeNames() {
    const rows = await dbGet<{names: string}>(`SELECT GROUP_CONCAT(b.name) as names FROM user_badges ub JOIN badges b ON b.id = ub.badge_id WHERE ub.user_id = ?`, [userId]);
    return rows?.names ? rows.names.split(',') : [];
  }

  test('No badges when below action threshold (9 actions)', async () => {
    for (let i=0;i<9;i++) {
      await dbRun(`INSERT INTO activities (activity_type, activity_title, activity_description, activity_date, user_id, imagem_path) VALUES ('transport','t${i}','d${i}','2025-01-0${(i%5)+1}',?,'img${i}.png')`,[userId]);
    }
    await checkAndAwardBadges(userId);
    expect(await getEarnedBadgeNames()).not.toContain('Primeiro Passo');
  });
  test('Award milestone badge at boundary (10 actions)', async () => {
    await dbRun(`INSERT INTO activities (activity_type, activity_title, activity_description, activity_date, user_id, imagem_path) VALUES ('transport','t10','d10','2025-01-06',?,'img10.png')`,[userId]);
    await checkAndAwardBadges(userId);
    expect(await getEarnedBadgeNames()).toContain('Primeiro Passo');
  });
  test('Badge persists above boundary (11 actions)', async () => {
    await dbRun(`INSERT INTO activities (activity_type, activity_title, activity_description, activity_date, user_id, imagem_path) VALUES ('transport','t11','d11','2025-01-07',?,'img11.png')`,[userId]);
    await checkAndAwardBadges(userId);
    expect(await getEarnedBadgeNames()).toContain('Primeiro Passo');
  });

  test('Award streak badge at boundary (current_streak = 7)', async () => {
    // Simulate streak days by updating users.current_streak directly (service handles this normally)
    await dbRun('UPDATE users SET current_streak = 6 WHERE id = ?', [userId]);
    await checkAndAwardBadges(userId);
    expect(await getEarnedBadgeNames()).not.toContain('7 Dias de Fogo');
    await dbRun('UPDATE users SET current_streak = 7 WHERE id = ?', [userId]);
    await checkAndAwardBadges(userId);
    expect(await getEarnedBadgeNames()).toContain('7 Dias de Fogo');
  });
});
