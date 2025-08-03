import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SocialLoginBox from "../app/components/SocialLoginBox";
import { ProvedorTema } from "../app/contextoTema";

// Função auxiliar para renderizar com o ProvedorTema
function renderComTema(ui: React.ReactElement) {
  return render(<ProvedorTema>{ui}</ProvedorTema>);
}

describe("SocialLoginBox", () => {
  it("deve renderizar corretamente os elementos principais", () => {
    renderComTema(<SocialLoginBox />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Acesse sua conta rapidamente/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuar com Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuar com Apple/i)).toBeInTheDocument();
  });

  it("deve chamar onGoogleLogin quando clicar no botão Google", () => {
    const mockGoogle = jest.fn();
    renderComTema(<SocialLoginBox onGoogleLogin={mockGoogle} />);
    fireEvent.click(screen.getByText(/Continuar com Google/i));
    expect(mockGoogle).toHaveBeenCalled();
  });

  it("deve chamar onAppleLogin quando clicar no botão Apple", () => {
    const mockApple = jest.fn();
    renderComTema(<SocialLoginBox onAppleLogin={mockApple} />);
    fireEvent.click(screen.getByText(/Continuar com Apple/i));
    expect(mockApple).toHaveBeenCalled();
  });
});