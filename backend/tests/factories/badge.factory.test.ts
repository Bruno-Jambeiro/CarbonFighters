/**
 * Badge Factory Tests
 * 
 * Comprehensive test suite for the BadgeFactory
 * Ensures the Factory Pattern implementation works correctly
 */

import { BadgeFactory } from '../../src/factories/badge.factory';
import { BadgeType } from '../../src/models/badge.model';

describe('BadgeFactory', () => {
    describe('createBadge - Factory Method', () => {
        describe('STREAK Badges', () => {
            it('should create a 7-day streak badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.STREAK, 7);
                
                expect(badge.type).toBe(BadgeType.STREAK);
                expect(badge.name).toBe('7 Dias de Fogo');
                expect(badge.description).toContain('7 dias consecutivos');
                expect(badge.icon).toBe('🔥');
                expect(badge.requirement).toBe(7);
                expect(badge.points).toBe(70); // 7 * 10
            });

            it('should create a 30-day streak badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.STREAK, 30);
                
                expect(badge.type).toBe(BadgeType.STREAK);
                expect(badge.name).toBe('Mestre da Consistência');
                expect(badge.requirement).toBe(30);
                expect(badge.points).toBe(300); // 30 * 10
            });

            it('should create a 100-day streak badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.STREAK, 100);
                
                expect(badge.name).toBe('Lenda Sustentável');
                expect(badge.points).toBe(1000);
            });

            it('should create a custom streak badge for non-standard days', () => {
                const badge = BadgeFactory.createBadge(BadgeType.STREAK, 15);
                
                expect(badge.name).toBe('Racha de 15 Dias');
                expect(badge.requirement).toBe(15);
                expect(badge.points).toBe(150);
            });
        });

        describe('MILESTONE Badges', () => {
            it('should create a 10 actions milestone badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 10);
                
                expect(badge.type).toBe(BadgeType.MILESTONE);
                expect(badge.name).toBe('Primeiro Passo');
                expect(badge.icon).toBe('👣');
                expect(badge.requirement).toBe(10);
                expect(badge.points).toBe(10);
            });

            it('should create a 100 actions milestone badge (Eco Rookie)', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 100);
                
                expect(badge.name).toBe('Eco Rookie');
                expect(badge.icon).toBe('🌱');
                expect(badge.points).toBe(100);
            });

            it('should create a 500 actions milestone badge (Eco Warrior)', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 500);
                
                expect(badge.name).toBe('Eco Warrior');
                expect(badge.icon).toBe('⚔️');
                expect(badge.points).toBe(500);
            });

            it('should create a 1000 actions milestone badge (Eco Legend)', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 1000);
                
                expect(badge.name).toBe('Eco Legend');
                expect(badge.icon).toBe('👑');
                expect(badge.points).toBe(1000);
            });

            it('should create a custom milestone badge for non-standard counts', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 250);
                
                expect(badge.name).toBe('250 Ações Completas');
                expect(badge.icon).toBe('🏆');
                expect(badge.points).toBe(250);
            });
        });

        describe('SPECIAL Event Badges', () => {
            it('should create Earth Day 2025 special badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.SPECIAL, 1);
                
                expect(badge.type).toBe(BadgeType.SPECIAL);
                expect(badge.name).toBe('Dia da Terra 2025');
                expect(badge.description).toContain('Dia da Terra');
                expect(badge.icon).toBe('⭐');
                expect(badge.points).toBe(500);
            });

            it('should create Zero Waste Challenge special badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.SPECIAL, 2);
                
                expect(badge.name).toBe('Campeão Zero Waste');
                expect(badge.points).toBe(750);
            });

            it('should create Environment Week special badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.SPECIAL, 3);
                
                expect(badge.name).toBe('Semana do Meio Ambiente');
                expect(badge.points).toBe(400);
            });

            it('should create a generic special badge for unknown event IDs', () => {
                const badge = BadgeFactory.createBadge(BadgeType.SPECIAL, 99);
                
                expect(badge.name).toBe('Evento Especial #99');
                expect(badge.points).toBe(500);
                expect(badge.icon).toBe('⭐');
            });
        });

        describe('CATEGORY Badges', () => {
            it('should create Green Transport Master badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.CATEGORY, 1);
                
                expect(badge.type).toBe(BadgeType.CATEGORY);
                expect(badge.name).toBe('Mestre do Transporte Verde');
                expect(badge.icon).toBe('🚲');
                expect(badge.requirement).toBe(50);
                expect(badge.points).toBe(300);
            });

            it('should create Recycling King badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.CATEGORY, 2);
                
                expect(badge.name).toBe('Rei da Reciclagem');
                expect(badge.icon).toBe('♻️');
            });

            it('should create Water Guardian badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.CATEGORY, 3);
                
                expect(badge.name).toBe('Guardião da Água');
                expect(badge.icon).toBe('💧');
            });

            it('should create Energy Warrior badge', () => {
                const badge = BadgeFactory.createBadge(BadgeType.CATEGORY, 4);
                
                expect(badge.name).toBe('Guerreiro da Energia');
                expect(badge.icon).toBe('⚡');
            });

            it('should create a generic category badge for unknown categories', () => {
                const badge = BadgeFactory.createBadge(BadgeType.CATEGORY, 99);
                
                expect(badge.name).toBe('Especialista Categoria #99');
                expect(badge.icon).toBe('🎖️');
                expect(badge.points).toBe(300);
            });
        });

        describe('Error Handling', () => {
            it('should throw error for unknown badge type', () => {
                expect(() => {
                    BadgeFactory.createBadge('INVALID_TYPE' as BadgeType, 10);
                }).toThrow('Unknown badge type: INVALID_TYPE');
            });

            it('should throw error for negative requirement', () => {
                expect(() => {
                    BadgeFactory.createBadge(BadgeType.STREAK, -5);
                }).toThrow('Badge requirement must be a positive number');
            });

            it('should accept zero as requirement', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 0);
                expect(badge.requirement).toBe(0);
                expect(badge.points).toBe(0);
            });
        });

        describe('Badge Properties Validation', () => {
            it('should create badges with all required fields', () => {
                const badge = BadgeFactory.createBadge(BadgeType.STREAK, 7);
                
                expect(badge).toHaveProperty('name');
                expect(badge).toHaveProperty('description');
                expect(badge).toHaveProperty('type');
                expect(badge).toHaveProperty('icon');
                expect(badge).toHaveProperty('requirement');
                expect(badge).toHaveProperty('points');
                
                expect(badge.name).toBeTruthy();
                expect(badge.description).toBeTruthy();
                expect(badge.icon).toBeTruthy();
            });

            it('should not include DB-generated fields (id, created_at) in created badges', () => {
                const badge = BadgeFactory.createBadge(BadgeType.MILESTONE, 100);
                
                // BadgeInput type doesn't have id and created_at - they are added by the database
                expect('id' in badge).toBe(false);
                expect('created_at' in badge).toBe(false);
                
                // But should have requirement_type
                expect(badge.requirement_type).toBeDefined();
            });
        });
    });

    describe('Helper Methods', () => {
        describe('getAvailableBadgeTypes', () => {
            it('should return all badge types', () => {
                const types = BadgeFactory.getAvailableBadgeTypes();
                
                expect(types).toContain(BadgeType.STREAK);
                expect(types).toContain(BadgeType.MILESTONE);
                expect(types).toContain(BadgeType.SPECIAL);
                expect(types).toContain(BadgeType.CATEGORY);
                expect(types.length).toBe(4);
            });
        });

        describe('getExampleBadges', () => {
            it('should return array of example badges', () => {
                const examples = BadgeFactory.getExampleBadges();
                
                expect(Array.isArray(examples)).toBe(true);
                expect(examples.length).toBeGreaterThan(0);
            });

            it('should include at least one badge of each type', () => {
                const examples = BadgeFactory.getExampleBadges();
                
                const types = examples.map(b => b.type);
                expect(types).toContain(BadgeType.STREAK);
                expect(types).toContain(BadgeType.MILESTONE);
                expect(types).toContain(BadgeType.SPECIAL);
                expect(types).toContain(BadgeType.CATEGORY);
            });

            it('should return valid badge objects', () => {
                const examples = BadgeFactory.getExampleBadges();
                
                examples.forEach(badge => {
                    expect(badge).toHaveProperty('name');
                    expect(badge).toHaveProperty('description');
                    expect(badge).toHaveProperty('type');
                    expect(badge).toHaveProperty('icon');
                    expect(badge).toHaveProperty('requirement');
                    expect(badge).toHaveProperty('points');
                });
            });
        });
    });

    describe('Points Calculation Logic', () => {
        it('should calculate streak badge points as days * 10', () => {
            expect(BadgeFactory.createBadge(BadgeType.STREAK, 5).points).toBe(50);
            expect(BadgeFactory.createBadge(BadgeType.STREAK, 15).points).toBe(150);
            expect(BadgeFactory.createBadge(BadgeType.STREAK, 50).points).toBe(500);
        });

        it('should set milestone badge points equal to action count', () => {
            expect(BadgeFactory.createBadge(BadgeType.MILESTONE, 75).points).toBe(75);
            expect(BadgeFactory.createBadge(BadgeType.MILESTONE, 200).points).toBe(200);
        });

        it('should set category badge points to 300', () => {
            expect(BadgeFactory.createBadge(BadgeType.CATEGORY, 1).points).toBe(300);
            expect(BadgeFactory.createBadge(BadgeType.CATEGORY, 5).points).toBe(300);
        });
    });
});
