/**
 * Área do Cliente - Sistema de Gerenciamento de Usuários
 * Inclui funcionalidades diferentes baseadas no nível de acesso
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

// Interfaces
interface User {
  id: string;
  name: string | null;
  email: string | null;
  accessLevel: number;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserFormData {
  name: string;
  email: string;
  accessLevel: number;
  isActive: boolean;
  newPassword?: string;
}

// Styled Components
const ClientAreaContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.borderFocus}40;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.borderFocus}40;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: ${theme.colors.onError};
          &:hover { background: ${theme.colors.errorHover}; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.onSecondary};
          &:hover { background: ${theme.colors.secondaryHover}; }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.onPrimary};
          &:hover { background: ${theme.colors.primaryHover}; }
        `;
    }
  }}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const AccessLevelBadge = styled.span<{ $level: number }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ $level, theme }) => {
    if ($level >= 4) return `background: ${theme.colors.error}; color: ${theme.colors.onError};`;
    if ($level >= 3) return `background: ${theme.colors.warning}; color: ${theme.colors.text};`;
    if ($level >= 2) return `background: ${theme.colors.info}; color: ${theme.colors.onPrimary};`;
    return `background: ${theme.colors.success}; color: ${theme.colors.onError};`;
  }}
`;

// Mapeamento de níveis de acesso
const accessLevels = {
  1: 'Usuário Normal',
  2: 'Premium',
  3: 'Manager',
  4: 'Admin',
  5: 'Super Admin'
};

const ClientArea: React.FC = () => {
  const { data: session, status } = useSession(); // Removido 'error' do destructuring para evitar warning
  const { currentTheme } = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    accessLevel: 1,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const userAccessLevel = (session?.user as { accessLevel?: number })?.accessLevel || 1;
  const isAdmin = userAccessLevel >= 4;

  // Carrega dados do usuário atual ou lista de usuários (se admin)
  useEffect(() => {
    if (session?.user) {
      if (isAdmin) {
        fetchAllUsers();
      } else {
        setFormData({
          name: session.user.name || '',
          email: session.user.email || '',
          accessLevel: userAccessLevel,
          isActive: true,
        });
      }
    }
  }, [session, isAdmin, userAccessLevel]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setMessage('Erro ao carregar usuários');
      }
    } catch (error) {
      setMessage('Erro ao carregar usuários');
      // 'error' capturado mas não utilizado
      // error não utilizado, apenas para capturar exceção
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = editingUser
        ? `/api/users/${editingUser.id}`
        : '/api/users/profile';

      const method = editingUser ? 'PUT' : 'PATCH';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Dados atualizados com sucesso!');
        if (isAdmin && editingUser) {
          fetchAllUsers();
          setEditingUser(null);
        }
        // Reset form
        setFormData({
          name: '',
          email: '',
          accessLevel: 1,
          isActive: true,
        });
      } else {
        const error = await response.json();
        setMessage(error.message || 'Erro ao atualizar dados');
      }
    } catch (error) {
      setMessage('Erro ao atualizar dados');
      // 'error' capturado mas não utilizado
      // error não utilizado, apenas para capturar exceção
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      accessLevel: user.accessLevel,
      isActive: user.isActive,
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Usuário excluído com sucesso!');
        fetchAllUsers();
      } else {
        setMessage('Erro ao excluir usuário');
      }
    } catch (error) {
      setMessage('Erro ao excluir usuário');
      // 'error' capturado mas não utilizado
      // error não utilizado, apenas para capturar exceção
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <ClientAreaContainer>
        <p>Carregando...</p>
      </ClientAreaContainer>
    );
  }

  if (!session) {
    return (
      <ClientAreaContainer>
        <p>Acesso negado. Faça login para continuar.</p>
      </ClientAreaContainer>
    );
  }

  return (
    <ClientAreaContainer>
      <Header>
        <Title>
          {isAdmin ? 'Painel Administrativo' : 'Área do Cliente'}
        </Title>
        <ThemeToggle />
      </Header>

      {message && (
        <Card>
          <p style={{ margin: 0, color: message.includes('Erro') ? currentTheme.colors.error : currentTheme.colors.success }}>
            {message}
          </p>
        </Card>
      )}

      {/* Formulário de edição de perfil */}
      <Card>
        <SectionTitle>
          {editingUser ? `Editando: ${editingUser.name}` : 'Meu Perfil'}
        </SectionTitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={!isAdmin && !editingUser}
            />
          </FormGroup>

          {isAdmin && (
            <>
              <FormGroup>
                <Label>Nível de Acesso</Label>
                <Select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: parseInt(e.target.value) }))}
                >
                  {Object.entries(accessLevels).map(([level, name]) => (
                    <option key={level} value={level}>{name}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Nova Senha (opcional)</Label>
            <Input
              type="password"
              value={formData.newPassword || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Deixe em branco para manter a atual"
            />
          </FormGroup>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>

            {editingUser && (
              <Button
                type="button"
                $variant="secondary"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ name: '', email: '', accessLevel: 1, isActive: true });
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </Form>
      </Card>

      {/* Lista de usuários (apenas para admins) */}
      {isAdmin && (
        <Card>
          <SectionTitle>Gerenciar Usuários</SectionTitle>

          {loading ? (
            <p>Carregando usuários...</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Nível</Th>
                  <Th>Status</Th>
                  <Th>Último Login</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <Td>{user.name || 'N/A'}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <AccessLevelBadge $level={user.accessLevel}>
                        {accessLevels[user.accessLevel as keyof typeof accessLevels]}
                      </AccessLevelBadge>
                    </Td>
                    <Td>{user.isActive ? 'Ativo' : 'Inativo'}</Td>
                    <Td>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          $variant="secondary"
                          onClick={() => handleEditUser(user)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          Editar
                        </Button>
                        {user.id !== session.user?.id && (
                          <Button
                            $variant="danger"
                            onClick={() => handleDeleteUser(user.id)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          >
                            Excluir
                          </Button>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </ClientAreaContainer>
  );
};

export default ClientArea;
