// Teste isolado para login social sem mock global do SocialLoginBox
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import LoginPage from '../app/login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    login: jest.fn(),
    status: 'unauthenticated',
  }),
}));

describe('Login social isolado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('aciona signIn do Google ao clicar no botão social', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (nextAuth.useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
    render(
      <ThemeProvider>
        <React.Suspense fallback={<div data-testid="suspense-fallback" />}>
          <LoginPage />
        </React.Suspense>
      </ThemeProvider>
    );
    const googleBtn = await screen.findByRole('button', { name: /google/i });
    fireEvent.click(googleBtn);
    await waitFor(() => {
      expect(nextAuth.signIn).toHaveBeenCalledWith('google', expect.any(Object));
    });
  });
});
