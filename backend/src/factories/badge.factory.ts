/**
 * Badge Factory - Factory Pattern Implementation
 * 
 * Centralizes the logic for creating different types of badges.
 * Follows the Factory Pattern to encapsulate object creation and
 * adhere to the Open/Closed Principle (SOLID).
 * 
 * Benefits:
 * - Single point of badge creation logic
 * - Easy to extend with new badge types
 * - Maintains consistency across badge creation
 * - Simplifies testing and maintenance
 */

import { Badge, BadgeType } from '../models/badge.model';

export class BadgeFactory {
    /**
     * Factory Method - Creates a badge based on type and requirement
     * 
     * @param type - The type of badge to create (STREAK, MILESTONE, SPECIAL, CATEGORY)
     * @param requirement - The numeric requirement (days, actions count, event id, etc.)
     * @returns A fully configured Badge object
     * @throws Error if badge type is unknown
     */
    static createBadge(type: BadgeType, requirement: number): Badge {
        if (requirement < 0) {
            throw new Error('Badge requirement must be a positive number');
        }

        switch (type) {
            case BadgeType.STREAK:
                return this.createStreakBadge(requirement);
            
            case BadgeType.MILESTONE:
                return this.createMilestoneBadge(requirement);
            
            case BadgeType.SPECIAL:
                return this.createSpecialBadge(requirement);
            
            case BadgeType.CATEGORY:
                return this.createCategoryBadge(requirement);
            
            default:
                throw new Error(`Unknown badge type: ${type}`);
        }
    }

    /**
     * Creates a Streak Badge for consecutive daily actions
     * 
     * @param days - Number of consecutive days
     * @returns Badge configured for streak achievement
     */
    private static createStreakBadge(days: number): Badge {
        const streakNames: { [key: number]: string } = {
            7: '7 Dias de Fogo',
            30: 'Mestre da Consistência',
            100: 'Lenda Sustentável'
        };

        const name = streakNames[days] || `Racha de ${days} Dias`;

        return {
            name,
            description: `Completou ${days} dias consecutivos de ações sustentáveis`,
            type: BadgeType.STREAK,
            icon: '🔥',
            requirement: days,
            points: days * 10
        };
    }

    /**
     * Creates a Milestone Badge for reaching action count milestones
     * 
     * @param count - Total number of sustainable actions
     * @returns Badge configured for milestone achievement
     */
    private static createMilestoneBadge(count: number): Badge {
        const milestones: { [key: number]: { name: string; icon: string } } = {
            10: { name: 'Primeiro Passo', icon: '👣' },
            50: { name: 'Em Progresso', icon: '🌿' },
            100: { name: 'Eco Rookie', icon: '🌱' },
            500: { name: 'Eco Warrior', icon: '⚔️' },
            1000: { name: 'Eco Legend', icon: '👑' },
            5000: { name: 'Guardião do Planeta', icon: '🌍' }
        };

        const milestone = milestones[count] || { 
            name: `${count} Ações Completas`, 
            icon: '🏆' 
        };

        return {
            name: milestone.name,
            description: `Completou ${count} ações sustentáveis`,
            type: BadgeType.MILESTONE,
            icon: milestone.icon,
            requirement: count,
            points: count
        };
    }

    /**
     * Creates a Special Event Badge for unique occasions
     * 
     * @param eventId - Identifier for the special event
     * @returns Badge configured for special event
     */
    private static createSpecialBadge(eventId: number): Badge {
        const specialEvents: { [key: number]: { name: string; description: string; points: number } } = {
            1: { 
                name: 'Dia da Terra 2025', 
                description: 'Participou do evento especial do Dia da Terra',
                points: 500 
            },
            2: { 
                name: 'Campeão Zero Waste', 
                description: 'Venceu o desafio comunitário Zero Waste',
                points: 750 
            },
            3: { 
                name: 'Semana do Meio Ambiente', 
                description: 'Participou da Semana do Meio Ambiente 2025',
                points: 400 
            }
        };

        const event = specialEvents[eventId] || {
            name: `Evento Especial #${eventId}`,
            description: 'Participou de um evento especial de sustentabilidade',
            points: 500
        };

        return {
            name: event.name,
            description: event.description,
            type: BadgeType.SPECIAL,
            icon: '⭐',
            requirement: eventId,
            points: event.points
        };
    }

    /**
     * Creates a Category Badge for specialization in action types
     * 
     * @param categoryId - Identifier for the action category
     * @returns Badge configured for category specialization
     */
    private static createCategoryBadge(categoryId: number): Badge {
        const categories: { [key: number]: { name: string; description: string; icon: string } } = {
            1: { 
                name: 'Mestre do Transporte Verde', 
                description: 'Completou 50 ações de transporte sustentável',
                icon: '🚲' 
            },
            2: { 
                name: 'Rei da Reciclagem', 
                description: 'Completou 50 ações de reciclagem',
                icon: '♻️' 
            },
            3: { 
                name: 'Guardião da Água', 
                description: 'Completou 50 ações de economia de água',
                icon: '💧' 
            },
            4: { 
                name: 'Guerreiro da Energia', 
                description: 'Completou 50 ações de economia de energia',
                icon: '⚡' 
            }
        };

        const category = categories[categoryId] || {
            name: `Especialista Categoria #${categoryId}`,
            description: 'Especialista em uma categoria de ações sustentáveis',
            icon: '🎖️'
        };

        return {
            name: category.name,
            description: category.description,
            type: BadgeType.CATEGORY,
            icon: category.icon,
            requirement: 50,
            points: 300
        };
    }

    /**
     * Helper method to get all available badge types
     * Useful for frontend to display available achievements
     */
    static getAvailableBadgeTypes(): BadgeType[] {
        return Object.values(BadgeType);
    }

    /**
     * Helper method to get example badges for each type
     * Useful for documentation and demo purposes
     */
    static getExampleBadges(): Badge[] {
        return [
            this.createBadge(BadgeType.STREAK, 7),
            this.createBadge(BadgeType.STREAK, 30),
            this.createBadge(BadgeType.MILESTONE, 100),
            this.createBadge(BadgeType.MILESTONE, 500),
            this.createBadge(BadgeType.SPECIAL, 1),
            this.createBadge(BadgeType.CATEGORY, 1)
        ];
    }
}
