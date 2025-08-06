"use client";
// A diretiva 'use client' deve ser sempre a primeira linha do arquivo para garantir que o componente seja client-side
import React from "react";
import { useSessaoAuth } from "../../hooks/useSessaoAuth";
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



export default function MenuLateralCliente() {
  const { usuario } = useSessaoAuth();
  const nivel = usuario?.accessLevel;
  return (
    <AsideMenu data-testid="menu-lateral">
      <NavMenu>
        <TituloMenu>Menu do Cliente</TituloMenu>
        <LinkMenu href="/area-cliente">Perfil</LinkMenu>
        <LinkMenu href="/servicos">Serviços</LinkMenu>
        <LinkMenu href="/contato">Contato / Orçamento</LinkMenu>
        <LinkMenu href="#">Meus Documentos</LinkMenu>
        <LinkMenu href="#">Solicitações</LinkMenu>
        {/* Exibe link administrativo apenas para nível 5 */}
        {nivel === 5 && (
          <LinkMenu href="/area-cliente/dashboard-admin">Dashboard Administrativo</LinkMenu>
        )}
      </NavMenu>
    </AsideMenu>
  );
}
