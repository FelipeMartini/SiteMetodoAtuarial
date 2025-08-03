// Testes unitários para o componente InputTexto do design system
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputTexto from "../app/design-system/InputTexto";

describe("InputTexto", () => {
  it("renderiza o label corretamente", () => {
    render(<InputTexto label="Nome" />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
  });

  it("chama onChange ao digitar", () => {
    const handleChange = jest.fn();
    render(<InputTexto label="Nome" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Teste" } });
    expect(handleChange).toHaveBeenCalled();
  });
});

// Comentário: Este teste garante que o InputTexto renderiza o label e dispara o evento onChange.
