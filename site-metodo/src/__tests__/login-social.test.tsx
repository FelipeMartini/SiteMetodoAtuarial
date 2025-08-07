// Teste isolado para login social sem mock global do SocialLoginBox
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@core/theme/ContextoTema';
import SocialLoginBox from '@core/components/SocialLoginBox';
import * as useSessaoAuthModule from '@/hooks/useSessaoAuth';



import type { useSessaoAuth } from '@/hooks/useSessaoAuth';
describe('Login social isolado', () => {
  let originalFetch: typeof fetch;

  beforeAll(() => {
    // Mock global fetch para evitar erro de URLs relativas
    originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'basic',
      url: '',
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      json: async () => ({}),
      text: async () => '',
    } as Response)) as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('aciona login do Google ao clicar no botão', async () => {
    const loginMock = jest.fn();
    jest.spyOn(useSessaoAuthModule, 'useSessaoAuth').mockReturnValue({
      login: loginMock,
      status: 'unauthenticated',
    } as unknown as ReturnType<typeof useSessaoAuth>);
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    const googleBtn = screen.getByRole('button', { name: /google/i });
    await act(async () => {
      fireEvent.click(googleBtn);
    });
    expect(loginMock).toHaveBeenCalledWith('google');
  });
});
