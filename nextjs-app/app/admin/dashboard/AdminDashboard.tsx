// Componente Dashboard de Administração
// Interface principal para gestão do sistema

'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import type { RootState } from '@/lib/store';
import {
  fetchDashboardStats,
  fetchNotifications
} from '@/lib/store/slices/dashboardSlice';
import { useAuth } from '@/app/hooks/useAuth';

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  
  &:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div<{ $color: string }>`
  padding: 8px;
  border-radius: 8px;
  background: ${props => props.$color};
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const StatChange = styled.div<{ $trend: 'up' | 'down' | 'neutral' }>`
  font-size: 14px;
  color: ${props =>
    props.$trend === 'up' ? '#10b981' :
      props.$trend === 'down' ? '#ef4444' : '#6b7280'
  };
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ActionCard = styled(motion.button)`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4f46e5;
    transform: translateY(-2px);
  }
`;

const ActionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ActionDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #dc2626;
  margin-bottom: 24px;
`;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user, hasRole } = useAuth();
  const dashboard = useSelector((state: RootState) => state.dashboard);

  // Verificar se o usuário tem permissão de admin
  if (!hasRole('admin')) {
    return (
      <DashboardContainer>
        <ErrorContainer>
          Acesso negado. Você não tem permissão para acessar o painel administrativo.
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  useEffect(() => {
    // Carregar dados do dashboard
    dispatch(fetchDashboardStats() as any);
    dispatch(fetchNotifications() as any);
  }, [dispatch]);

  if (dashboard.statsLoading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <div>Carregando dashboard...</div>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  const stats = dashboard.stats;

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard Administrativo</Title>
        <Subtitle>
          Bem-vindo, {user?.name}. Aqui você pode gerenciar todo o sistema.
        </Subtitle>
      </Header>

      {dashboard.error && (
        <ErrorContainer>
          Erro ao carregar dados: {dashboard.error}
        </ErrorContainer>
      )}

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Total de Usuários</StatTitle>
            <StatIcon $color="#4f46e5">
              <UsersIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.overview?.totalUsers || '0'}</StatValue>
          <StatChange $trend="up">
            +{stats?.overview?.recentUsers || 0} novos este mês
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatHeader>
            <StatTitle>Usuários Ativos</StatTitle>
            <StatIcon $color="#10b981">
              <ChartBarIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.overview?.activeUsers || '0'}</StatValue>
          <StatChange $trend="up">
            {stats?.metrics?.activeUserRate || 0}% do total
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>Notificações</StatTitle>
            <StatIcon $color="#f59e0b">
              <BellIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>{dashboard.notifications.length}</StatValue>
          <StatChange $trend="neutral">
            {dashboard.unreadCount} não lidas
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Administradores</StatTitle>
            <StatIcon $color="#8b5cf6">
              <CogIcon />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.overview?.adminUsers || '0'}</StatValue>
          <StatChange $trend="neutral">
            {stats?.metrics?.adminUserRate || 0}% do total
          </StatChange>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/admin/usuarios'}
        >
          <ActionTitle>Gerenciar Usuários</ActionTitle>
          <ActionDescription>
            Visualizar, criar, editar e remover usuários do sistema
          </ActionDescription>
        </ActionCard>

        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/admin/configuracoes'}
        >
          <ActionTitle>Configurações</ActionTitle>
          <ActionDescription>
            Ajustar configurações gerais do sistema e preferências
          </ActionDescription>
        </ActionCard>

        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/admin/relatorios'}
        >
          <ActionTitle>Relatórios</ActionTitle>
          <ActionDescription>
            Visualizar relatórios de uso e métricas do sistema
          </ActionDescription>
        </ActionCard>

        <ActionCard
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/admin/atividades'}
        >
          <ActionTitle>Log de Atividades</ActionTitle>
          <ActionDescription>
            Consultar atividades e auditoria do sistema
          </ActionDescription>
        </ActionCard>
      </QuickActions>
    </DashboardContainer>
  );
}
