-- Seed predefined badges (CA1: Predefined set of milestones)

-- STREAK Badges
INSERT OR IGNORE INTO badges (name, description, type, icon, requirement, requirement_type, points) VALUES
('7 Dias de Fogo', 'Mantenha uma sequência de 7 dias consecutivos de ações sustentáveis', 'streak', '🔥', 7, 'streak_days', 70),
('Mestre da Consistência', 'Complete ações sustentáveis por 30 dias seguidos', 'streak', '🔥', 30, 'streak_days', 300),
('Lenda Sustentável', 'Alcance uma sequência incrível de 100 dias de ações ecológicas', 'streak', '🔥', 100, 'streak_days', 1000);

-- MILESTONE Badges (for number of actions completed)
INSERT OR IGNORE INTO badges (name, description, type, icon, requirement, requirement_type, points) VALUES
('Primeiro Passo', 'Complete suas primeiras 10 ações sustentáveis', 'milestone', '👣', 10, 'actions_count', 10),
('Eco Rookie', 'Alcance 100 ações sustentáveis completas', 'milestone', '🌱', 100, 'actions_count', 100),
('Eco Warrior', 'Complete 500 ações em prol do meio ambiente', 'milestone', '⚔️', 500, 'actions_count', 500),
('Eco Legend', 'Atinja a marca de 1000 ações sustentáveis!', 'milestone', '👑', 1000, 'actions_count', 1000);

-- SPECIAL Event Badges
INSERT OR IGNORE INTO badges (name, description, type, icon, requirement, requirement_type, points) VALUES
('Dia da Terra 2025', 'Participe das ações especiais do Dia da Terra', 'special', '⭐', 1, 'special_event', 500),
('Campeão Zero Waste', 'Complete o desafio Zero Waste de uma semana', 'special', '⭐', 1, 'special_event', 750),
('Primeiro Grupo', 'Únete a tu primer grupo y empieza a colaborar', 'special', '👥', 1, 'group_join', 50);

-- CATEGORY Badges (by action type)
INSERT OR IGNORE INTO badges (name, description, type, icon, requirement, requirement_type, category, points) VALUES
('Mestre do Transporte Verde', 'Complete 50 ações na categoria de transporte sustentável', 'category', '🚲', 50, 'category_count', 'transport', 300),
('Rei da Reciclagem', 'Realize 50 ações de reciclagem', 'category', '♻️', 50, 'category_count', 'recycling', 300),
('Guardião da Água', 'Complete 50 ações de conservação de água', 'category', '💧', 50, 'category_count', 'water', 300),
('Herói da Energia', 'Complete 50 ações de ahorro de energía', 'category', '⚡', 50, 'category_count', 'energy', 300);
