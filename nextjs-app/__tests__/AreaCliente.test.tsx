import { render, screen } from "@testing-library/react";
import type { Session } from "next-auth";
import AreaCliente from "../app/area-cliente/page";
import React from "react";

// Mock do arquivo route.ts para evitar execução real do NextAuth
jest.mock("../app/api/auth/[...nextauth]/route", () => ({
  authOptions: {}
}));

// Mock da função redirect do next/navigation para todos os testes
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn(),
}));

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

// Mock do MenuLateralCliente para evitar renderização real
jest.mock("../app/area-cliente/MenuLateralCliente", () => () => <div data-testid="menu-lateral">Menu Lateral</div>);

// Teste principal da área do cliente
describe("Página da Área do Cliente", () => {
  it("deve exibir o perfil do usuário logado e o menu lateral", async () => {
    // Renderiza o componente autenticado
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
    // Mocka getServerSession para retornar null (usuário não autenticado)
    const getServerSession = require("next-auth").getServerSession;
    getServerSession.mockImplementationOnce(() => Promise.resolve(null));
    // Mocka redirect para lançar uma exceção e interromper o fluxo
    const redirect = require("next/navigation").redirect;
    redirect.mockImplementation(() => { throw new Error("Redirecionado"); });
    // Executa a função assíncrona, que deve chamar redirect e interromper o fluxo
    await expect(AreaCliente()).rejects.toThrow("Redirecionado");
    // Verifica se o redirect foi chamado para /login
    expect(redirect).toHaveBeenCalledWith("/login");
    // Comentário: O teste interrompe o fluxo após o redirecionamento para evitar erro de leitura de propriedades de sessão nula.
  });
});

it("deve redirecionar para login se não estiver autenticado", async () => {
  // Comentário: Este teste cobre o fluxo de redirecionamento para login quando o usuário não está autenticado.
  // O mock de getServerSession já foi implementado acima para simular sessão nula.
  // O mock de redirect do next/navigation já foi implementado acima.
  // O teste já está coberto acima, evitando duplicidade e erro de sintaxe.
});

// Comentário: Testes da página protegida AreaCliente, cobrindo perfil, menu lateral e redirecionamento para login.
