/**
 * Sistema de Autorização Moderno - Baseado no Fuse-React
 * 
 * Define hierarquia de roles e permissões para o sistema.
 * Inspirado no sistema do fuse-react para máxima flexibilidade.
 */

/**
 * Configuração de roles hierárquicos
 * Cada role inclui suas próprias permissões + todas as roles de níveis inferiores
 */
export const authRoles = {
  /**
   * Administrador do Sistema
   * - Acesso total ao sistema
   * - Gerenciamento de usuários, roles e configurações
   * - Acesso a logs de auditoria e ferramentas administrativas
   */
  admin: ['admin'],

  /**
   * Staff/Moderador
   * - Acesso administrativo limitado
   * - Pode gerenciar conteúdo e usuários básicos
   * - Não pode alterar configurações críticas do sistema
   */
  staff: ['admin', 'staff'],

  /**
   * Usuário Autenticado
   * - Acesso padrão ao sistema
   * - Pode usar todas as funcionalidades básicas
   * - Acesso a recursos do usuário logado
   */
  user: ['admin', 'staff', 'user'],

  /**
   * Apenas Convidados (não autenticados)
   * - Acesso apenas a páginas públicas
   * - Login, registro, páginas de informação
   * - Usado para restringir acesso apenas a usuários não logados
   */
  onlyGuest: [],

  /**
   * Acesso Público (sem restrições)
   * - Qualquer usuário, autenticado ou não
   * - Usado para recursos completamente abertos
   */
  public: null,
} as const;

/**
 * Type para roles válidos
 */
export type AuthRole = keyof typeof authRoles;

/**
 * Type para array de roles de usuário
 */
export type UserRole = string[] | string | null;

/**
 * Configurações de permissões especiais
 */
export const specialPermissions = {
  /**
   * Permissões de sistema críticas (apenas admin)
   */
  system: {
    manageUsers: ['admin'],
    viewAuditLogs: ['admin'],
    manageSettings: ['admin'],
    systemMaintenance: ['admin'],
  },

  /**
   * Permissões de conteúdo (admin + staff)
   */
  content: {
    create: ['admin', 'staff'],
    edit: ['admin', 'staff'],
    delete: ['admin', 'staff'],
    publish: ['admin', 'staff'],
  },

  /**
   * Permissões de usuário padrão
   */
  user: {
    viewProfile: ['admin', 'staff', 'user'],
    editProfile: ['admin', 'staff', 'user'],
    changePassword: ['admin', 'staff', 'user'],
  },
} as const;

/**
 * Mapeamento de accessLevel legado para novo sistema de roles
 * Para migração gradual do sistema antigo
 */
export const accessLevelToRoles: Record<string, string[]> = {
  // Sistema legado -> Novo sistema
  'admin': ['admin'],
  'administrador': ['admin'],
  'moderador': ['staff'],
  'staff': ['staff'],
  'usuario': ['user'],
  'user': ['user'],
  'guest': [],
  'publico': [],
  'public': [],
} as const;

/**
 * Helper para obter roles a partir do accessLevel legado
 */
export function migrateAccessLevelToRoles(accessLevel: string): string[] {
  const normalized = accessLevel?.toLowerCase() || 'user';
  return accessLevelToRoles[normalized] || ['user'];
}

export default authRoles;
