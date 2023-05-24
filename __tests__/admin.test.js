import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import Admin from '../src/pages/admin';

// Then later in your test setup...
const useEffectSpy = jest.spyOn(React, 'useEffect');
useEffectSpy.mockImplementation(f => f());


jest.mock('../src/pages/components/navBar', () => {
    return {
      __esModule: true,
      default: () => <div data-testid="navbar">Mock Navbar</div>,
    }
});

jest.mock('next-auth/react', () => ({
    ...jest.requireActual('next-auth/react'),
    useSession: jest.fn(),
}));


jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
/*       route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn().mockResolvedValue(true),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isReady: true,
      isPreview: false,
      isLocaleDomain: false,
      basePath: '', */
    })),
  }));

describe('Admin page', () => {

    const mockProps = {
        result: [{
            "username": "Andreas",
            "name": "Andreas Jack Christiansen",
            "password": "password",
            "role": "admin",
            "department_id": 0,
            "age": "20"
        }]
    };

    it('should render the result username', () => {
        const mockSession = { user: { name: 'Andreas' } };
        useSession.mockReturnValue(mockSession);
        
        render(
            <Admin {...mockProps} />
            );
            
            expect(mockProps.result[0].name).toBe('Andreas Jack Christiansen');
    });
    it('should render the session', () => {
        const mockSession = { user: { name: 'Andreas' } };
        useSession.mockReturnValue(mockSession);
        
        render(
            <Admin {...mockProps} />
        );
            
        expect(mockSession.user.name).toBe('Andreas');
    });
            
    it('should render the navbar', () => {
        const mockSession = { user: { name: 'Andreas' } };
        useSession.mockReturnValue({ 
            data: mockSession,
            status: 'authenticated',
            error: null,});

        render(
            <Admin {...mockProps} />
        );
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render the link to manage employees', () => {
        const mockSession = { user: { name: 'Andreas' } };
        useSession.mockReturnValue({
            data: mockSession,
            status: 'authenticated',
            error: null,});

        render(
            <Admin {...mockProps} />
        );
            
        expect(screen.getByText('Manage Employees')).toBeInTheDocument();
        expect(screen.getByText('Manage Work Schedule')).toBeInTheDocument();
    });
});