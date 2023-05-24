import generateSchedule from "@/pages/algorithmscheduleimprover";
import '@testing-library/jest-dom';

const mockEmployee = [
    {username: 'emp1'},
    {username: 'emp2'},
    { username: 'emp3' },
    { username: 'emp4' },
    { username: 'emp5' },
    { username: 'emp6' },
    { username: 'emp7' },
    { username: 'emp8' },
    { username: 'emp9' },
    { username: 'emp10' },
];

const mockYouth = [
    {username: 'youth1'},
    {username: 'youth2'},
    { username: 'youth3' },
    { username: 'youth4' },
    { username: 'youth5' },
    { username: 'youth6' },
    { username: 'youth7' },
    { username: 'youth8' },
    { username: 'youth9' },
    { username: 'youth10' },
];

const preference = [
    {username: 'emp1', Monday: 1, Tuesday: 2, Wednesday: 0, Thursday: 1, Friday: 1, Saturday: 2, Sunday: 1},
    { username: 'emp2', Monday: 2, Tuesday: 1, Wednesday: 1, Thursday: 2, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'emp3', Monday: 1, Tuesday: 2, Wednesday: 0, Thursday: 1, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'emp4', Monday: 2, Tuesday: 1, Wednesday: 1, Thursday: 2, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'emp5', Monday: 1, Tuesday: 2, Wednesday: 0, Thursday: 1, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'emp6', Monday: 2, Tuesday: 1, Wednesday: 1, Thursday: 2, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'emp7', Monday: 1, Tuesday: 2, Wednesday: 0, Thursday: 1, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'emp8', Monday: 2, Tuesday: 1, Wednesday: 1, Thursday: 2, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'emp9', Monday: 1, Tuesday: 2, Wednesday: 0, Thursday: 1, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'emp10', Monday: 2, Tuesday: 1, Wednesday: 1, Thursday: 2, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'youth1', Monday: 1, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'youth2', Monday: 2, Tuesday: 2, Wednesday: 1, Thursday: 1, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'youth3', Monday: 1, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'youth4', Monday: 2, Tuesday: 2, Wednesday: 1, Thursday: 1, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'youth5', Monday: 1, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'youth6', Monday: 2, Tuesday: 2, Wednesday: 1, Thursday: 1, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'youth7', Monday: 1, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'youth8', Monday: 2, Tuesday: 2, Wednesday: 1, Thursday: 1, Friday: 0, Saturday: 1, Sunday: 2 },
    { username: 'youth9', Monday: 1, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 1, Saturday: 2, Sunday: 1 },
    { username: 'youth10', Monday: 2, Tuesday: 2, Wednesday: 1, Thursday: 1, Friday: 0, Saturday: 1, Sunday: 2 },
];

describe('generateSchedule', () => {
    it('should return an object which contains schedule, fitnessValue and count', async () => {
        const result = await generateSchedule(mockEmployee, mockYouth, preference);

        expect(result).toHaveProperty('schedule');
        expect(result).toHaveProperty('fitnessValue');
        expect(result).toHaveProperty('count');

        expect(typeof result.schedule).toBe('object');
        expect(typeof result.fitnessValue).toBe('number');
        expect(typeof result.count).toBe('number');
    });
});
