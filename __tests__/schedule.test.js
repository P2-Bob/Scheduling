import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Schedule from '../src/pages/schedule';
import { SessionProvider, useSession } from 'next-auth/react';
import { executeQuery } from "../lib/db";

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

describe('Schedule', () => {
    // Provide the props that getServerSideProps would normally supply
    const mockProps = {
        userSchedule: [
            {
                "schedule_id": 1,
                "username": "noah01",
                "shift_id": 3,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 2,
                "username": "simon01",
                "shift_id": 2,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 3,
                "username": "betina01",
                "shift_id": 1,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 4,
                "username": "sofia01",
                "shift_id": 3,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 5,
                "username": "magnus01",
                "shift_id": 1,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 6,
                "username": "david01",
                "shift_id": 2,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 7,
                "username": "alexander01",
                "shift_id": 1,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 8,
                "username": "nicolai01",
                "shift_id": 1,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 9,
                "username": "lucas01",
                "shift_id": 3,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 10,
                "username": "nicolai01",
                "shift_id": 1,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 11,
                "username": "nanna01",
                "shift_id": 3,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 12,
                "username": "brian01",
                "shift_id": 1,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 13,
                "username": "david01",
                "shift_id": 2,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 14,
                "username": "oscar01",
                "shift_id": 3,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 15,
                "username": "felix01",
                "shift_id": 3,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 16,
                "username": "clara01",
                "shift_id": 3,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 17,
                "username": "camilla01",
                "shift_id": 2,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 18,
                "username": "dorthe01",
                "shift_id": 2,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 19,
                "username": "nanna01",
                "shift_id": 2,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 20,
                "username": "julie01",
                "shift_id": 1,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 21,
                "username": "henrik01",
                "shift_id": 1,
                "work_day": "Wednesday",
                "date": "2023-05-31"
            },
            {
                "schedule_id": 22,
                "username": "georg01",
                "shift_id": 2,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 23,
                "username": "william01",
                "shift_id": 3,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 24,
                "username": "christian01",
                "shift_id": 1,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 25,
                "username": "frederikke01",
                "shift_id": 2,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 26,
                "username": "jens01",
                "shift_id": 3,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 27,
                "username": "georg01",
                "shift_id": 2,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 28,
                "username": "louise01",
                "shift_id": 2,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 29,
                "username": "lasse01",
                "shift_id": 1,
                "work_day": "Tuesday",
                "date": "2023-05-30"
            },
            {
                "schedule_id": 30,
                "username": "eline01",
                "shift_id": 1,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 31,
                "username": "simon01",
                "shift_id": 2,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 32,
                "username": "isabella01",
                "shift_id": 2,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 33,
                "username": "ida01",
                "shift_id": 3,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 34,
                "username": "alexander01",
                "shift_id": 1,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 35,
                "username": "isabella01",
                "shift_id": 2,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 36,
                "username": "magnus01",
                "shift_id": 1,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 37,
                "username": "freja01",
                "shift_id": 3,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 38,
                "username": "kristine01",
                "shift_id": 1,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 39,
                "username": "karl01",
                "shift_id": 3,
                "work_day": "Thursday",
                "date": "2023-06-01"
            },
            {
                "schedule_id": 40,
                "username": "birgitte01",
                "shift_id": 2,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 41,
                "username": "frederikke01",
                "shift_id": 3,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 42,
                "username": "david01",
                "shift_id": 2,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 43,
                "username": "mathilde01",
                "shift_id": 3,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 44,
                "username": "oliver01",
                "shift_id": 3,
                "work_day": "Friday",
                "date": "2023-06-02"
            },
            {
                "schedule_id": 45,
                "username": "jens01",
                "shift_id": 1,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 46,
                "username": "emma01",
                "shift_id": 1,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 47,
                "username": "eline01",
                "shift_id": 1,
                "work_day": "Monday",
                "date": "2023-05-29"
            },
            {
                "schedule_id": 48,
                "username": "betina01",
                "shift_id": 2,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 49,
                "username": "simon01",
                "shift_id": 2,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 50,
                "username": "helle01",
                "shift_id": 1,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 51,
                "username": "william01",
                "shift_id": 2,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 52,
                "username": "christian01",
                "shift_id": 1,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 53,
                "username": "noah01",
                "shift_id": 1,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 54,
                "username": "alma01",
                "shift_id": 3,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 55,
                "username": "oscar01",
                "shift_id": 3,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 56,
                "username": "lilly01",
                "shift_id": 3,
                "work_day": "Saturday",
                "date": "2023-06-03"
            },
            {
                "schedule_id": 57,
                "username": "erik01",
                "shift_id": 1,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 58,
                "username": "camilla01",
                "shift_id": 2,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 59,
                "username": "felix01",
                "shift_id": 2,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 60,
                "username": "oscar01",
                "shift_id": 2,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 61,
                "username": "sofia01",
                "shift_id": 3,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 62,
                "username": "frank01",
                "shift_id": 3,
                "work_day": "Sunday",
                "date": "2023-06-04"
            },
            {
                "schedule_id": 63,
                "username": "gustav01",
                "shift_id": 3,
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
        users: [
            {
                "username": "alexander01",
                "name": "Alexander Due",
                "password": "pass9101!",
                "role": "employee",
                "department_id": 0,
                "age": "22"
            },
            {
                "username": "alma01",
                "name": "Alma Madsen",
                "password": "pass246!",
                "role": "employee",
                "department_id": 2,
                "age": "16"
            },
            {
                "username": "Andreas",
                "name": "Andreas Jack Christiansen",
                "password": "password",
                "role": "admin",
                "department_id": 0,
                "age": "20"
            },
            {
                "username": "betina01",
                "name": "Betina Rasmussen",
                "password": "pass2021!",
                "role": "employee",
                "department_id": 4,
                "age": "35"
            },
            {
                "username": "birgitte01",
                "name": "Birgitte Petersen",
                "password": "pass2425!",
                "role": "employee",
                "department_id": 6,
                "age": "30"
            },
            {
                "username": "brian01",
                "name": "Brian Jørgensen",
                "password": "pass2223!",
                "role": "employee",
                "department_id": 5,
                "age": "38"
            },
            {
                "username": "camilla01",
                "name": "Camilla Nielsen",
                "password": "pass5678!",
                "role": "employee",
                "department_id": 4,
                "age": "39"
            },
            {
                "username": "cecilie01",
                "name": "Cecilie Thomsen",
                "password": "pass2829!",
                "role": "employee",
                "department_id": 2,
                "age": "41"
            },
            {
                "username": "christian01",
                "name": "Christian Poulsen",
                "password": "pass2627!",
                "role": "employee",
                "department_id": 1,
                "age": "36"
            },
            {
                "username": "clara01",
                "name": "Clara Poulsen",
                "password": "pass147!",
                "role": "employee",
                "department_id": 6,
                "age": "16"
            },
            {
                "username": "david01",
                "name": "David Sørensen",
                "password": "pass3031!",
                "role": "employee",
                "department_id": 3,
                "age": "20"
            },
            {
                "username": "dorthe01",
                "name": "Dorthe Mortensen",
                "password": "pass3233!",
                "role": "employee",
                "department_id": 4,
                "age": "33"
            },
            {
                "username": "eline01",
                "name": "Eline Schmidt",
                "password": "pass3637!",
                "role": "employee",
                "department_id": 6,
                "age": "24"
            },
            {
                "username": "emma01",
                "name": "Emma Larsen",
                "password": "pass321!",
                "role": "employee",
                "department_id": 4,
                "age": "17"
            },
            {
                "username": "erik01",
                "name": "Erik Knudsen",
                "password": "pass3435!",
                "role": "employee",
                "department_id": 5,
                "age": "27"
            },
            {
                "username": "felix01",
                "name": "Felix Schmidt",
                "password": "pass963!",
                "role": "employee",
                "department_id": 5,
                "age": "16"
            },
            {
                "username": "frank01",
                "name": "Frank Kristensen",
                "password": "pass3839!",
                "role": "employee",
                "department_id": 1,
                "age": "45"
            },
            {
                "username": "frederikke01",
                "name": "Frederikke Eriksen",
                "password": "pass4041!",
                "role": "employee",
                "department_id": 2,
                "age": "46"
            },
            {
                "username": "freja01",
                "name": "Freja Pedersen",
                "password": "pass987!",
                "role": "employee",
                "department_id": 6,
                "age": "17"
            },
            {
                "username": "georg01",
                "name": "Georg Lauridsen",
                "password": "pass4243!",
                "role": "employee",
                "department_id": 3,
                "age": "28"
            },
            {
                "username": "gitte01",
                "name": "Gitte Jensen",
                "password": "pass4445!",
                "role": "employee",
                "department_id": 4,
                "age": "31"
            },
            {
                "username": "gustav01",
                "name": "Gustav Eriksen",
                "password": "pass753!",
                "role": "employee",
                "department_id": 1,
                "age": "16"
            },
            {
                "username": "helle01",
                "name": "Helle Larsen",
                "password": "pass4849!",
                "role": "employee",
                "department_id": 6,
                "age": "50"
            },
            {
                "username": "henrik01",
                "name": "Henrik Nielsen",
                "password": "pass4647!",
                "role": "employee",
                "department_id": 5,
                "age": "49"
            },
            {
                "username": "ida01",
                "name": "Ida Jørgensen",
                "password": "pass753!",
                "role": "employee",
                "department_id": 4,
                "age": "16"
            },
            {
                "username": "isabella01",
                "name": "Isabella Kjeldsen",
                "password": "pass8910!",
                "role": "employee",
                "department_id": 4,
                "age": "19"
            },
            {
                "username": "jakob01",
                "name": "Jakob Jensen",
                "password": "pass1234!",
                "role": "employee",
                "department_id": 3,
                "age": "45"
            },
            {
                "username": "jens01",
                "name": "Jens Hansen",
                "password": "pass123!",
                "role": "employee",
                "department_id": 1,
                "age": "17"
            },
            {
                "username": "julie01",
                "name": "Julie Ravn",
                "password": "pass5273!",
                "role": "employee",
                "department_id": 1,
                "age": "28"
            },
            {
                "username": "karl01",
                "name": "Karl Thomsen",
                "password": "pass258!",
                "role": "employee",
                "department_id": 1,
                "age": "16"
            },
            {
                "username": "kristine01",
                "name": "Kristine Broberg",
                "password": "pass1021!",
                "role": "employee",
                "department_id": 6,
                "age": "30"
            },
            {
                "username": "lasse01",
                "name": "Lasse Pedersen",
                "password": "pass1415!",
                "role": "employee",
                "department_id": 1,
                "age": "25"
            },
            {
                "username": "lilly01",
                "name": "Lilly Knudsen",
                "password": "pass852!",
                "role": "employee",
                "department_id": 4,
                "age": "16"
            },
            {
                "username": "louise01",
                "name": "Louise Andersen",
                "password": "pass1617!",
                "role": "employee",
                "department_id": 2,
                "age": "28"
            },
            {
                "username": "lucas01",
                "name": "Lucas Nielsen",
                "password": "pass789!",
                "role": "employee",
                "department_id": 3,
                "age": "17"
            },
            {
                "username": "luna01",
                "name": "Luna Sørensen",
                "password": "pass369!",
                "role": "employee",
                "department_id": 2,
                "age": "16"
            },
            {
                "username": "magnus01",
                "name": "Magnus Frost",
                "password": "pass2132!",
                "role": "employee",
                "department_id": 1,
                "age": "40"
            },
            {
                "username": "malene01",
                "name": "Malene Christensen",
                "password": "pass1213!",
                "role": "employee",
                "department_id": 6,
                "age": "40"
            },
            {
                "username": "martin01",
                "name": "Martin Madsen",
                "password": "pass1819!",
                "role": "employee",
                "department_id": 3,
                "age": "48"
            },
            {
                "username": "mathilde01",
                "name": "Mathilde Lauridsen",
                "password": "pass864!",
                "role": "employee",
                "department_id": 3,
                "age": "16"
            },
            {
                "username": "nanna01",
                "name": "Nanna Birk",
                "password": "pass6782!",
                "role": "employee",
                "department_id": 2,
                "age": "34"
            },
            {
                "username": "nicolai01",
                "name": "Nicolai Dalgaard",
                "password": "pass7891!",
                "role": "employee",
                "department_id": 3,
                "age": "45"
            },
            {
                "username": "noah01",
                "name": "Noah Christensen",
                "password": "pass654!",
                "role": "employee",
                "department_id": 5,
                "age": "17"
            },
            {
                "username": "oliver01",
                "name": "Oliver Rasmussen",
                "password": "pass369!",
                "role": "employee",
                "department_id": 3,
                "age": "16"
            },
            {
                "username": "oscar01",
                "name": "Oscar Petersen",
                "password": "pass951!",
                "role": "employee",
                "department_id": 5,
                "age": "16"
            },
            {
                "username": "simon01",
                "name": "Simon Larsen",
                "password": "pass9101!",
                "role": "employee",
                "department_id": 5,
                "age": "32"
            },
            {
                "username": "sofia01",
                "name": "Sofia Jensen",
                "password": "pass456!",
                "role": "employee",
                "department_id": 2,
                "age": "17"
            },
            {
                "username": "victoria01",
                "name": "Victoria Kristensen",
                "password": "pass159!",
                "role": "employee",
                "department_id": 6,
                "age": "16"
            },
            {
                "username": "viktor01",
                "name": "Viktor Mortensen",
                "password": "pass741!",
                "role": "employee",
                "department_id": 3,
                "age": "16"
            },
            {
                "username": "william01",
                "name": "William Andersen",
                "password": "pass135!",
                "role": "employee",
                "department_id": 1,
                "age": "16"
            }
        ]
    };

    it('renders Navbar', () => {
        // Mock session data
        const mockSession = { user: { name: 'alexander01' } };

        // Mock getSession to return the mock session
        useSession.mockReturnValue(mockSession);

        render(
            <Schedule {...mockProps} />
        );
 
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('finds correct user', () => {
        // Mock session data
        const mockSession = { user: { name: 'alexander01' } };

        // Mock getSession to return the mock session
        useSession.mockReturnValue(mockSession);

        render(
            <Schedule {...mockProps} />
        );
 
        expect(mockProps.users.find(user => user.username === mockSession.user.name)).toBeTruthy();
    });

    it('renders h1', () => {
        // Mock session data
        const mockSession = { user: { name: 'alexander01' } };

        // Mock getSession to return the mock session
        useSession.mockReturnValue(mockSession);

        render(
            <Schedule {...mockProps} />
        );
 
        expect(screen.getByText('Your Upcoming Shifts')).toBeInTheDocument();
    });

    it('renders WeekGridTable', () => {
        // Mock session data
        const mockSession = { user: { name: 'alexander01' } };

        // Mock getSession to return the mock session
        useSession.mockReturnValue(mockSession);

        render(
            <Schedule {...mockProps} />
        );
 
        expect(screen.getByTestId('weekGridTable')).toBeInTheDocument();
    });

});