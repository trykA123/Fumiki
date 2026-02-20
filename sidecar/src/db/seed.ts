import { db } from './db';

const CATEGORIES = [
    { id: 'mind', name: 'Mind', order: 10 },
    { id: 'world', name: 'World', order: 20 },
    { id: 'craft', name: 'Craft', order: 30 },
    { id: 'wealth', name: 'Wealth', order: 40 },
    { id: 'self', name: 'Self', order: 50 },
    { id: 'stories', name: 'Stories', order: 60 },
    { id: 'art', name: 'Art', order: 70 }
];

export function seedDatabase() {
    console.log('--- Seeding ---');

    const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, display_order)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO NOTHING;
  `);

    const applySeeds = db.transaction(() => {
        for (const cat of CATEGORIES) {
            insertCategory.run(cat.id, cat.name, cat.order);
        }
    });

    try {
        applySeeds();
        console.log('✅  Categories seeded seamlessly.');
    } catch (err) {
        console.error('❌ Failed to seed categories:', err);
    }
}
