// Testes unitários para o componente CardInfo do design system
import React from "react";
import { render, screen } from "@testing-library/react";
import CardInfo from "../app/design-system/CardInfo";

describe("CardInfo", () => {
  it("renderiza o título corretamente", () => {
    render(<CardInfo titulo="Título Teste" />);
    expect(screen.getByText("Título Teste")).toBeInTheDocument();
  });

  it("renderiza a descrição quando fornecida", () => {
    render(<CardInfo titulo="Título" descricao="Descrição Teste" />);
    expect(screen.getByText("Descrição Teste")).toBeInTheDocument();
  });

  it("renderiza children corretamente", () => {
    render(
      <CardInfo titulo="Título">
        <div>Conteúdo Extra</div>
      </CardInfo>
    );
    expect(screen.getByText("Conteúdo Extra")).toBeInTheDocument();
  });
});

// Comentário: Este teste garante que o CardInfo renderiza título, descrição e children corretamente.
