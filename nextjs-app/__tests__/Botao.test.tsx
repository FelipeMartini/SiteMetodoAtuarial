// Testes unitários para o componente Botao do design system
import React from "react";
import { render, screen } from "@testing-library/react";
import Botao from "../app/design-system/Botao";

describe("Botao", () => {
  it("renderiza o texto corretamente", () => {
    render(<Botao>Enviar</Botao>);
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  it("aplica as props corretamente", () => {
    render(<Botao variant="contained" color="primary">Teste</Botao>);
    const botao = screen.getByText("Teste");
    expect(botao).toHaveClass("MuiButton-containedPrimary");
  });
});

// Comentário: Este teste garante que o componente Botao renderiza corretamente o texto e aplica as props do Material-UI.
