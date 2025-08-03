// Testes unitários para o componente InputTexto do design system
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputTexto from "../app/design-system/InputTexto";

describe("InputTexto", () => {
  it("renderiza o label corretamente", () => {
    // Passa o id para garantir acessibilidade
    render(<InputTexto label="Nome" id="input-nome" />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
  });

  it("chama onChange ao digitar", () => {
    const handleChange = jest.fn();
    // Passa o id para garantir acessibilidade
    render(<InputTexto label="Nome" id="input-nome" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Teste" } });
    expect(handleChange).toHaveBeenCalled();
  });
});

// Comentário: Este teste garante que o InputTexto renderiza o label e dispara o evento onChange.
