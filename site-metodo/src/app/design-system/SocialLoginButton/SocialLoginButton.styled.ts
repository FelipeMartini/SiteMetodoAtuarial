import styled from 'styled-components';

export const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  outline: none;
  min-height: 3rem;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surfaceVariant};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;
