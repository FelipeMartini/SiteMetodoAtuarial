import { render, screen } from "@testing-library/react";
import type { Session } from "next-auth";
import AreaCliente from "../app/area-cliente/page";

// Mock do arquivo route.ts para evitar execução real do NextAuth
jest.mock("../app/api/auth/[...nextauth]/route", () => ({
  authOptions: {}
}));
import React from "react";

// Mock do getServerSession para simular usuário autenticado
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      name: "Usuário Teste",
      email: "teste@exemplo.com",
      image: "https://via.placeholder.com/120"
    }
  }))
}));

// Mock do MenuLateralCliente
jest.mock("../app/area-cliente/MenuLateralCliente", () => () => <div data-testid="menu-lateral">Menu Lateral</div>);

describe("Página da Área do Cliente", () => {
  it("deve exibir o perfil do usuário logado", async () => {
    // Renderiza o componente
    const Componente = await AreaCliente();
    render(Componente);

    // Verifica se o nome e email aparecem
    expect(screen.getByText(/Usuário Teste/)).toBeInTheDocument();
    expect(screen.getByText(/teste@exemplo.com/)).toBeInTheDocument();
    // Verifica se a imagem aparece
    expect(screen.getByAltText(/Foto do usuário/)).toBeInTheDocument();
    // Verifica se o menu lateral aparece
    expect(screen.getByTestId("menu-lateral")).toBeInTheDocument();
  });

  it("deve redirecionar para login se não estiver autenticado", async () => {
    // Simula sessão nula
    jest.spyOn(require("next-auth"), "getServerSession").mockImplementationOnce(() => Promise.resolve(null));
    // Mock do redirect
    const redirectMock = jest.fn();
    jest.spyOn(require("next/navigation"), "redirect").mockImplementation(redirectMock);
    await AreaCliente();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });
});

// Comentário: Este teste cobre os principais fluxos da página protegida, garantindo que o perfil e o menu lateral sejam exibidos corretamente para usuários autenticados e que o redirecionamento ocorra para não autenticados.
