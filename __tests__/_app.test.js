import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getSession } from 'next-auth/react';
import App from '../src/pages/_app';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
  SessionProvider: ({ children }) => <div data-testid="session-provider">{children}</div>,
}));

jest.mock('../src/pages/components/protectedPages', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="protected-pages">{children}</div>,
  };
});

describe('_app', () => {
  it('renders correctly with session', () => {
    // Mock session data
    const mockSession = { user: { name: 'John' } };

    // Mock getSession to return the mock session
    getSession.mockReturnValue(mockSession);

    // Render the App component with mock props
    const { getByTestId } = render(
      <App Component={() => <div>Hello</div>} pageProps={{ session: mockSession }} />
    );

    // Assertions
    expect(getByTestId('session-provider')).toBeInTheDocument();
    expect(getByTestId('protected-pages')).toBeInTheDocument();
    expect(getByTestId('protected-pages')).toHaveTextContent('Hello');
  });
});
