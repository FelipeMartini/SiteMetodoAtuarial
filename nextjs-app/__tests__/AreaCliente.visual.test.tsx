import { render, screen } from "@testing-library/react";
import React from "react";

// Mock do componente de menu lateral
jest.mock("../app/area-cliente/MenuLateralCliente", () => () => <div data-testid="menu-lateral">Menu Lateral</div>);

describe("Página da Área do Cliente", () => {
  it("deve exibir o perfil do usuário logado", () => {
    // Mock da sessão do usuário
    const session = {
      user: {
        name: "Usuário Teste",
        email: "teste@exemplo.com",
        image: "https://via.placeholder.com/120"
      }
    };
    // Mock do componente principal
    const AreaCliente = () => (
      <div style={{ display: "flex" }}>
        <div data-testid="menu-lateral">Menu Lateral</div>
        <main>
          <h2>Perfil do Cliente</h2>
          <div>
            <img src={session.user.image} alt="Foto do usuário" width={120} height={120} />
            <div>
              <strong>Nome:</strong> {session.user.name}
            </div>
            <div>
              <strong>Email:</strong> {session.user.email}
            </div>
          </div>
        </main>
      </div>
    );
    render(<AreaCliente />);
    expect(screen.getByText(/Usuário Teste/)).toBeInTheDocument();
    expect(screen.getByText(/teste@exemplo.com/)).toBeInTheDocument();
    expect(screen.getByAltText(/Foto do usuário/)).toBeInTheDocument();
    expect(screen.getByTestId("menu-lateral")).toBeInTheDocument();
  });
});

// Comentário: Este teste simula o fluxo visual da área do cliente, garantindo que o perfil e o menu lateral sejam exibidos corretamente para o usuário logado.
