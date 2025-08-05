"use client";
// A diretiva 'use client' deve ser sempre a primeira linha do arquivo para garantir que o componente seja client-side
import React from "react";
// Diretiva para garantir que o componente seja client-side
/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */

// Importação do componente Link do Next.js para navegação interna
import Link from "next/link";
import styled from "styled-components";

// Componente estilizado para o menu lateral
// Estilização do menu lateral e links para alternância de tema
const AsideMenu = styled.aside`
  width: 220px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 24px;
  margin-right: 32px;
  min-height: 320px;
`;
const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const TituloMenu = styled.strong`
  margin-bottom: 12px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};
`;
const LinkMenu = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;



/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */
export default function MenuLateralCliente() {
  return (
    <AsideMenu data-testid="menu-lateral">
      <NavMenu>
        {/* Título do menu lateral */}
        <TituloMenu>Menu do Cliente</TituloMenu>
        {/* Link para perfil do cliente */}
        <LinkMenu href="/area-cliente">Perfil</LinkMenu>
        {/* Link para serviços */}
        <LinkMenu href="/servicos">Serviços</LinkMenu>
        {/* Link para contato/orçamento */}
        <LinkMenu href="/contato">Contato / Orçamento</LinkMenu>
        {/* Link para documentos do cliente */}
        <LinkMenu href="#">Meus Documentos</LinkMenu>
        {/* Link para solicitações do cliente */}
        <LinkMenu href="#">Solicitações</LinkMenu>
        {/* Link para sair (logout) - pode ser implementado posteriormente */}
        {/* <LinkMenu href="/logout">Sair</LinkMenu> */}
      </NavMenu>
    </AsideMenu>
  );
}
