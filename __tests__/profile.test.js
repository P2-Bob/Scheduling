import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '@/pages/profile';
import { useMediaQuery } from '../lib/mediaQuery';
import { useState as useStateMock } from 'react';

// Mock the useMediaQuery hook
jest.mock('../lib/mediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));

jest.mock('../src/pages/components/navBar', () => {
    return {
      __esModule: true,
      default: () => <div data-testid="navbar">Mock Navbar</div>,
    }
});

jest.mock('../src/pages/components/weekGridTable', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="weekGridTable">Mock WeekGridTable</div>,
    }
});

jest.mock('next-auth/react', () => {
    return {
      ...jest.requireActual('next-auth/react'),
      useSession: jest.fn(),
    };
});

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

const setState = jest.fn()

describe('Schedule', () => {
    beforeEach(() => {
        useStateMock.mockImplementation(init => [init, setState]);
    });


    // Provide the props that getServerSideProps would normally supply
    const mockProps = {
        result: [{
            "username": "alexander01",
            "name": "Alexander Due",
            "password": "pass9101!",
            "role": "employee",
            "department_id": 1,
            "age": "22"
        }],
        departments: [
            {
            "department_id": 0,
            "department_name": "Boss",
            },
            {
            "department_id": 1,
            "department_name": "Clothes",
        }],
        mySchedule: [
            {
                "schedule_id": 19,
                "username": "alexander01",
                "shift_id": 1,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 83,
                "username": "alexander01",
                "shift_id": 3,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 122,
                "username": "alexander01",
                "shift_id": 2,
                "work_day": "Sunday",
                "date": "2023-06-04"
            }
        ],
        myPreferences: [
            {
                "username": "alexander01",
                "case_id": 48,
                "monday": 0,
                "tuesday": 2,
                "wednesday": 1,
                "thursday": 0,
                "friday": 2,
                "saturday": 0,
                "sunday": 1
        }],
    };

    it('renders Navbar', () => {
        // Mock the return value of useMediaQuery
        useMediaQuery.mockReturnValue(false);

        render(
            <Profile {...mockProps} />
        );
 
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    describe('Rendering of user information', () => {
        it('Correct rendering of user information', () => {
            // Mock the return value of useMediaQuery
            useMediaQuery.mockReturnValue(false);

            render(
                <Profile {...mockProps} />
            );
                
            expect(screen.getByText('AD')).toBeInTheDocument();
            expect(screen.getByText('Alexander Due')).toBeInTheDocument();
            expect(screen.getByText('Department: Clothes')).toBeInTheDocument();
            expect(screen.getByText('Age: 22')).toBeInTheDocument();
            expect(screen.getByText('Hours Worked: 21')).toBeInTheDocument();
        });
    });
    describe('Preferences display', () => {
        it('Displays preferences when editing false', () => {
            // Mock the usestate hook editingPreference
            useStateMock.mockReturnValueOnce([false, jest.fn()])
            
            // Mock the return value of useMediaQuery
            useMediaQuery.mockReturnValue(true);


            render(
                <Profile {...mockProps} />
            );
                
            expect(screen.getByText('Preferences')).toBeInTheDocument();
            expect(screen.getByText('Mon')).toBeInTheDocument();
            expect(screen.getByText('Tue')).toBeInTheDocument();
            expect(screen.getByText('Wed')).toBeInTheDocument();
            expect(screen.getByText('Thu')).toBeInTheDocument();
            expect(screen.getByText('Fri')).toBeInTheDocument();
            expect(screen.getByText('Sat')).toBeInTheDocument();
            expect(screen.getByText('Sun')).toBeInTheDocument();
            expect(screen.getByText('Edit Preferences')).toBeInTheDocument();
        });

        it('Displays preferences when editing true', () => {
            // Mock the usestate hook editingPreference
            useStateMock.mockReturnValueOnce([true, jest.fn()])
            
            // Mock the return value of useMediaQuery
            useMediaQuery.mockReturnValue(true);

            render(
                <Profile {...mockProps} />
            );

            expect(screen.getByText('Back')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
        });
    });
});