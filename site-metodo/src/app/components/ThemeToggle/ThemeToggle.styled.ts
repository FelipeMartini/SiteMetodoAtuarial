import styled from 'styled-components';

export const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ThemeButton = styled.button<{ $isActive?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.outline};
    outline-offset: 2px;
  }
`;

export const LightThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #F7F8FA 0%, #FFFFFF 100%);
`;

export const DarkThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #121212 0%, #1E1E1E 100%);
`;

export const BlueThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #E3F2FD 0%, #1976D2 100%);
`;

export const GreenThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #E8F5E8 0%, #2E7D32 100%);
`;

export const PurpleThemeButton = styled(ThemeButton)`
  background: linear-gradient(135deg, #F3E5F5 0%, #7B1FA2 100%);
`;

export const ThemeLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.md};
`;
