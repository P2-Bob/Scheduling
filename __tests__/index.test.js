import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index';
import '@testing-library/jest-dom';
import { useMediaQuery } from '../lib/mediaQuery';

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

jest.mock('../src/pages/components/dayGridTable', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="dayGridTable">Mock DayGridTable</div>,
    }
});

describe('Home', () => {
    // Provide the props that getServerSideProps would normally supply
    const mockProps = {
        result: [{
            "username": "alexander01",
            "name": "Alexander Due",
            "password": "pass9101!",
            "role": "employee",
            "department_id": 0,
            "age": "22"
        }],
        userSchedule: [
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
        shiftName: [
            {
                "shift_id": 1,
                "shift_time": "6-14"
            },
            {
                "shift_id": 2,
                "shift_time": "14-22"
            },
            {
                "shift_id": 3,
                "shift_time": "17-22"
            }
        ],
    };

    it('renders Navbar', () => {
        // Mock the return value of useMediaQuery
        useMediaQuery.mockReturnValue(false);

        render(<Home {...mockProps} />);
 
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    describe('Media query returns false', () => {
        it('renders DayGridTable', () => {
            useMediaQuery.mockReturnValue(false);

            render(<Home {...mockProps} />);

            expect(screen.getByTestId('dayGridTable')).toBeInTheDocument();
        });
    });

    describe('Media query returns true', () => {
        it('does not render DayGridTable', () => {
            useMediaQuery.mockReturnValue(true);

            render(<Home {...mockProps} />);

            expect(screen.queryByTestId('dayGridTable')).not.toBeInTheDocument();
        });

        it('renders shift list when media query returns true', () => {
            useMediaQuery.mockReturnValue(true);
        
            render(<Home {...mockProps} />);
        
            // Check if the shift list is rendered correctly
            const shift1 = screen.getByText('Wednesday');
            const shift1Date = screen.getByText('31.5.2023');
            const shift1Time = screen.getByText('6:00 - 14:00');

            const shift2 = screen.getByText('Tuesday');
            const shift2Date = screen.getByText('30.5.2023');
            const shift2Time = screen.getByText('17:00 - 22:00');

            const shift3 = screen.getByText('Sunday');
            const shift3Date = screen.getByText('4.6.2023');
            const shift3Time = screen.getByText('14:00 - 22:00');
        
            expect(shift1).toBeInTheDocument();
            expect(shift1Date).toBeInTheDocument();
            expect(shift1Time).toBeInTheDocument();

            expect(shift3).toBeInTheDocument();
            expect(shift3Date).toBeInTheDocument();
            expect(shift3Time).toBeInTheDocument();
        });
    });
});