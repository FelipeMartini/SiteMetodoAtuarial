// Interface de gestão de usuários para administradores
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store/store';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setFilters,
  setSort,
  setSearchTerm,
  clearError,
  selectUser,
  clearSelectedUser,
} from '@/lib/store/slices/userManagementSlice';
import { addNotification } from '@/lib/store/slices/dashboardSlice';
import styled from 'styled-components';

// Componentes de UI básicos
const Container = styled.div`
  padding: 2rem;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover { background: ${props.theme.colors.primaryDark}; }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
        `;
      default:
        return `
          background: ${props.theme.colors.secondary};
          color: ${props.theme.colors.text};
          &:hover { background: ${props.theme.colors.secondaryLight}; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FiltersSection = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.secondary};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: ${props => props.theme.colors.background}50;
  }
  
  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primary}20;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  vertical-align: middle;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'blocked' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: #2ecc71;
          color: white;
        `;
      case 'blocked':
        return `
          background: #e74c3c;
          color: white;
        `;
      default:
        return `
          background: #95a5a6;
          color: white;
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.text};
`;

const ErrorMessage = styled.div`
  background: #e74c3c;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

interface UserFormData {
  name: string;
  email: string;
  accessLevel: number;
  status: 'active' | 'inactive' | 'blocked';
}

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    totalPages,
    filters,
    sortBy,
    sortOrder,
    searchTerm,
    selectedUser,
  } = useSelector((state: RootState) => state.userManagement);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    accessLevel: 1,
    status: 'active',
  });

  // Carregar usuários na inicialização
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, currentPage, filters, sortBy, sortOrder, searchTerm]);

  // Limpar erros após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleSort = (field: string) => {
    dispatch(setSort({
      field,
      order: sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCreateUser = async () => {
    try {
      await dispatch(createUser(formData)).unwrap();
      dispatch(addNotification({
        title: 'Usuário criado',
        message: `Usuário ${formData.name} foi criado com sucesso`,
        type: 'success'
      }));
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      dispatch(addNotification({
        title: 'Erro ao criar usuário',
        message: error as string,
        type: 'error'
      }));
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(updateUser({
        id: selectedUser.id,
        data: formData
      })).unwrap();
      dispatch(addNotification({
        title: 'Usuário atualizado',
        message: `Usuário ${formData.name} foi atualizado com sucesso`,
        type: 'success'
      }));
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      dispatch(addNotification({
        title: 'Erro ao atualizar usuário',
        message: error as string,
        type: 'error'
      }));
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      dispatch(addNotification({
        title: 'Usuário excluído',
        message: `Usuário ${selectedUser.name} foi excluído com sucesso`,
        type: 'success'
      }));
      setShowDeleteModal(false);
      dispatch(clearSelectedUser());
    } catch (error) {
      dispatch(addNotification({
        title: 'Erro ao excluir usuário',
        message: error as string,
        type: 'error'
      }));
    }
  };

  const openEditModal = (user: any) => {
    dispatch(selectUser(user));
    setFormData({
      name: user.name,
      email: user.email,
      accessLevel: user.accessLevel,
      status: user.status || 'active',
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: any) => {
    dispatch(selectUser(user));
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      accessLevel: 1,
      status: 'active',
    });
    dispatch(clearSelectedUser());
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const getAccessLevelLabel = (level: number) => {
    const levels = {
      1: 'Normal',
      2: 'Premium',
      3: 'Manager',
      4: 'Admin',
      5: 'SuperAdmin',
    };
    return levels[level as keyof typeof levels] || 'Desconhecido';
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container>
      <Header>
        <Title>Gestão de Usuários</Title>
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Novo Usuário
          </Button>
          <Button
            onClick={() => dispatch(fetchUsers())}
            disabled={loading}
          >
            🔄 Atualizar
          </Button>
        </ButtonGroup>
      </Header>

      {error && (
        <ErrorMessage>
          {error}
          <Button
            style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
            onClick={() => dispatch(clearError())}
          >
            ✕
          </Button>
        </ErrorMessage>
      )}

      <FiltersSection>
        <FiltersGrid>
          <InputGroup>
            <Label>Buscar</Label>
            <Input
              type="text"
              placeholder="Nome ou email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Nível de Acesso</Label>
            <Select
              value={filters.accessLevel || ''}
              onChange={(e) => handleFilterChange('accessLevel', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Todos os níveis</option>
              <option value="1">Normal</option>
              <option value="2">Premium</option>
              <option value="3">Manager</option>
              <option value="4">Admin</option>
              <option value="5">SuperAdmin</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Status</Label>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || null)}
            >
              <option value="">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="blocked">Bloqueado</option>
            </Select>
          </InputGroup>
        </FiltersGrid>
      </FiltersSection>

      {loading ? (
        <LoadingSpinner>
          Carregando usuários...
        </LoadingSpinner>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell onClick={() => handleSort('name')}>
                  Nome {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('accessLevel')}>
                  Acesso {sortBy === 'accessLevel' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('createdAt')}>
                  Criado em {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('lastLogin')}>
                  Último Login {sortBy === 'lastLogin' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getAccessLevelLabel(user.accessLevel)}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status || 'active'}>
                      {user.status === 'active' ? 'Ativo' :
                        user.status === 'blocked' ? 'Bloqueado' : 'Inativo'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <Button
                        onClick={() => openEditModal(user)}
                        style={{ padding: '0.5rem' }}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => openDeleteModal(user)}
                        style={{ padding: '0.5rem' }}
                      >
                        🗑️
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <div>
              Mostrando {users.length} de {totalUsers} usuários
            </div>
            <ButtonGroup>
              <Button
                disabled={currentPage <= 1}
                onClick={() => dispatch(setFilters({ page: currentPage - 1 }))}
              >
                ← Anterior
              </Button>
              <span style={{ padding: '0 1rem' }}>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                disabled={currentPage >= totalPages}
                onClick={() => dispatch(setFilters({ page: currentPage + 1 }))}
              >
                Próxima →
              </Button>
            </ButtonGroup>
          </Pagination>
        </>
      )}

      {/* Modal de Criação */}
      <Modal isOpen={showCreateModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Criar Novo Usuário</ModalTitle>
            <CloseButton onClick={closeModals}>✕</CloseButton>
          </ModalHeader>

          <InputGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
            />
          </InputGroup>

          <InputGroup style={{ marginTop: '1rem' }}>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </InputGroup>

          <InputGroup style={{ marginTop: '1rem' }}>
            <Label>Nível de Acesso</Label>
            <Select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: parseInt(e.target.value) })}
            >
              <option value={1}>Normal</option>
              <option value={2}>Premium</option>
              <option value={3}>Manager</option>
              <option value={4}>Admin</option>
              <option value={5}>SuperAdmin</option>
            </Select>
          </InputGroup>

          <InputGroup style={{ marginTop: '1rem' }}>
            <Label>Status</Label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="blocked">Bloqueado</option>
            </Select>
          </InputGroup>

          <ButtonGroup style={{ marginTop: '2rem', justifyContent: 'flex-end' }}>
            <Button onClick={closeModals}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={handleCreateUser}
              disabled={!formData.name || !formData.email}
            >
              Criar Usuário
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>

      {/* Modal de Edição */}
      <Modal isOpen={showEditModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Editar Usuário</ModalTitle>
            <CloseButton onClick={closeModals}>✕</CloseButton>
          </ModalHeader>

          <InputGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
            />
          </InputGroup>

          <InputGroup style={{ marginTop: '1rem' }}>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </InputGroup>

          <InputGroup style={{ marginTop: '1rem' }}>
            <Label>Nível de Acesso</Label>
            <Select
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: parseInt(e.target.value) })}
            >
              <option value={1}>Normal</option>
              <option value={2}>Premium</option>
              <option value={3}>Manager</option>
              <option value={4}>Admin</option>
              <option value={5}>SuperAdmin</option>
            </Select>
          </InputGroup>

          <InputGroup style={{ marginTop: '1rem' }}>
            <Label>Status</Label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="blocked">Bloqueado</option>
            </Select>
          </InputGroup>

          <ButtonGroup style={{ marginTop: '2rem', justifyContent: 'flex-end' }}>
            <Button onClick={closeModals}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={handleEditUser}
              disabled={!formData.name || !formData.email}
            >
              Salvar Alterações
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={showDeleteModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirmar Exclusão</ModalTitle>
            <CloseButton onClick={closeModals}>✕</CloseButton>
          </ModalHeader>

          <p style={{ marginBottom: '2rem', color: 'inherit' }}>
            Tem certeza de que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
            Esta ação não pode ser desfeita.
          </p>

          <ButtonGroup style={{ justifyContent: 'flex-end' }}>
            <Button onClick={closeModals}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
            >
              Excluir Usuário
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UserManagement;
