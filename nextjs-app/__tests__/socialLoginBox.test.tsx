import { render, screen, fireEvent } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SocialLoginBox', () => {
  it('renderiza os botões oficiais Google e Apple', () => {
    render(<SocialLoginBox />);
    expect(screen.getByAltText('Entrar com Google')).toBeInTheDocument();
    expect(screen.getByAltText('Entrar com Apple')).toBeInTheDocument();
  });

  it('aciona signIn do Google ao clicar no botão', () => {
    render(<SocialLoginBox />);
    const googleBtn = screen.getByAltText('Entrar com Google').closest('button');
    expect(googleBtn).not.toBeNull();
    fireEvent.click(googleBtn!);
    expect(signIn).toHaveBeenCalledWith('google', expect.any(Object));
  });

  it('aciona signIn da Apple ao clicar no botão', () => {
    render(<SocialLoginBox />);
    const appleBtn = screen.getByAltText('Entrar com Apple').closest('button');
    expect(appleBtn).not.toBeNull();
    fireEvent.click(appleBtn!);
    expect(signIn).toHaveBeenCalledWith('apple', expect.any(Object));
  });
});
