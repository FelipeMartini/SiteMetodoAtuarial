'use client';

import React from 'react';
import { useTema } from '@/app/contexts/ThemeContext';
import {
  ThemeToggleContainer,
  ThemeLabel,
  LightThemeButton,
  DarkThemeButton,
  BlueThemeButton,
  GreenThemeButton,
  PurpleThemeButton,
} from './ThemeToggle.styled';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useTema();

  const themeButtons = [
    { name: 'light' as const, Component: LightThemeButton, label: 'Light' },
    { name: 'dark' as const, Component: DarkThemeButton, label: 'Dark' },
  ];

  return (
    <ThemeToggleContainer>
      <ThemeLabel>Temas:</ThemeLabel>
      {themeButtons.map(({ name, Component, label }) => (
        <Component
          key={name}
          $isActive={currentTheme.name === name}
          onClick={() => setTheme(name)}
          title={`Mudar para tema ${label}`}
          aria-label={`Mudar para tema ${label}`}
        />
      ))}
    </ThemeToggleContainer>
  );
};

export default ThemeToggle;
