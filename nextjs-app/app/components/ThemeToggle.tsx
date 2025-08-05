/**
 * Seletor de Tema Moderno
 * Toggle simples entre light/dark theme
 */
'use client';

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggleContainer = styled.button`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  outline: none;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.borderFocus}40;
  }
`;

const ThemeToggleSlider = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $isDark }) => $isDark ? '32px' : '2px'};
  width: 22px;
  height: 22px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ThemeToggleContainer
      onClick={toggleTheme}
      aria-label={`Mudar para tema ${isDarkMode ? 'claro' : 'escuro'}`}
      title={`Mudar para tema ${isDarkMode ? 'claro' : 'escuro'}`}
    >
      <ThemeToggleSlider $isDark={isDarkMode}>
        {isDarkMode ? '🌙' : '☀️'}
      </ThemeToggleSlider>
    </ThemeToggleContainer>
  );
};

export default ThemeToggle;
