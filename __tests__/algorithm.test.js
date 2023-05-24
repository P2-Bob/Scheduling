import generateSchedule from "/pages/algorithmscheduleimproved";

const mockEmployee = [
    {username: 'emp1'},
    {username: 'emp2'},
    {username: 'emp3'}
];

const mockYouth = [
    {username: 'youth1'},
    {username: 'youth2'},
    {username: 'youth3'}
];

const preference = [
    {username: 'emp1', Monday: 1, Tuesday: 2, Wednesday: 0, Thursday: 1, Friday: 1, Saturday: 2, Sunday: 1},
    {username: 'emp2', Monday: 2, Tuesday: 1, Wednesday: 1, Thursday: 2, Friday: 0, Saturday: 1, Sunday: 2},
    {username: 'youth1', Monday: 1, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 1, Saturday: 2, Sunday: 1},
];

descirbe('generateSchedule', () => {
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
