"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const Rodape: React.FC = React.memo(function Rodape() {
  return (
    <footer className="bg-background text-muted-foreground border-t border-border pt-8">
      <div className="container mx-auto flex flex-wrap justify-between items-start gap-8 py-8">
        <section className="flex-1 min-w-[200px] mb-4">
          <h4 className="text-lg font-semibold mb-4">Institucional</h4>
          <a href="/sobre" className="block text-primary hover:underline mb-2">Sobre</a>
          <a href="/servicos" className="block text-primary hover:underline mb-2">Serviços</a>
          <a href="/contato" className="block text-primary hover:underline">Contato</a>
        </section>
        <section className="flex-1 min-w-[200px] mb-4">
          <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
          <a href="/area-cliente" className="block text-primary hover:underline mb-2">Área do Cliente</a>
          <a href="/criar-conta" className="block text-primary hover:underline mb-2">Criar Conta</a>
          <a href="/login" className="block text-primary hover:underline">Login</a>
        </section>
        <section className="flex-1 min-w-[200px] mb-4">
          <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook-f text-xl"></i>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin-in text-xl"></i>
              </a>
            </Button>
          </div>
        </section>
      </div>
      <div className="text-center py-4 border-t border-border text-xs text-muted-foreground">
        © {new Date().getFullYear()} Método Atuarial. Todos os direitos reservados.
      </div>
    </footer>
  );
});

export default Rodape;