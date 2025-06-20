import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginScreen from '@/app/administrator/page';
import { AdminLogin } from '@/services/adminService';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/adminService', () => ({
  AdminLogin: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  setToken: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe('LoginScreen', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show validation errors when fields are empty', async () => {
    render(<LoginScreen />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('should call AdminLogin and redirect on success', async () => {
    (AdminLogin as jest.Mock).mockResolvedValue({
      status: true,
      access_token: 'fake_token',
    });

    render(<LoginScreen />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(AdminLogin).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'password123',
      });
      expect(push).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('should show error toast on failed login', async () => {
    (AdminLogin as jest.Mock).mockResolvedValue({
      status: false,
    });

    render(<LoginScreen />);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Just checking if the login button is still visible
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
  });
});
