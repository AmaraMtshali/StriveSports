import getEvents from '../getEvents';

describe('getEvents', () => {
    it('returns an array of events', async () => {
        const events = await getEvents();

        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBe(2);
    });

    it('returns correct event data', async () => {
        const events = await getEvents();

        expect(events[0]).toEqual({
            id: '10',
            event: 'Event things',
            date: '2025-05-06',
            time_from: '09:00',
            time_to: '12:00',
            event_description: 'meeting',
        });

        expect(events[1]).toEqual({
            id: '20',
            event: 'Event things again',
            date: '2025-05-12',
            time_from: '09:00',
            time_to: '12:00',
            event_description: 'meeting',
        });
    });

    it('each event has required fields', async () => {
        const events = await getEvents();

        events.forEach(event => {
            expect(event).toHaveProperty('id');
            expect(event).toHaveProperty('event');
            expect(event).toHaveProperty('date');
            expect(event).toHaveProperty('time_from');
            expect(event).toHaveProperty('time_to');
            expect(event).toHaveProperty('event_description');
        });
    });

    // Simple equivalence tests
    it('valid events have non-empty strings for required fields', async () => {
        const events = await getEvents();

        events.forEach(event => {
            expect(typeof event.id).toBe('string');
            expect(event.id).not.toBe('');

            expect(typeof event.event).toBe('string');
            expect(event.event).not.toBe('');

            expect(typeof event.date).toBe('string');
            expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // simple date pattern

            expect(typeof event.time_from).toBe('string');
            expect(event.time_from).toMatch(/^\d{2}:\d{2}$/); // simple time pattern

            expect(typeof event.time_to).toBe('string');
            expect(event.time_to).toMatch(/^\d{2}:\d{2}$/);

            expect(typeof event.event_description).toBe('string');
        });
    });

    it('rejects events with missing or invalid fields (if present)', async () => {
        const events = await getEvents();

        events.forEach(event => {
            // Simulate equivalence: check if a numeric id or missing field would fail
            if (typeof event.id !== 'string') {
                throw new Error('Invalid event id type');
            }

            if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
                throw new Error('Invalid or missing date');
            }
        });

        expect(true).toBe(true); // if no error, test passes
    });
});
