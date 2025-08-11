import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { WebSocketMessage, NotificationSocketData, NotificationData } from '@/types/notifications'
import { simpleLogger } from '@/lib/simple-logger'
import { getNotificationService } from './notification-service'

/**
 * Servidor WebSocket para notificações real-time
 * Gerencia conexões de usuários e distribui notificações em tempo real
 */
export class NotificationWebSocketServer {
  private wss: WebSocketServer
  private userConnections: Map<string, Set<WebSocket>> = new Map()
  private heartbeatInterval?: NodeJS.Timeout

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({
      port,
      verifyClient: this.verifyClient.bind(this),
    })

    this.setupServer()
    this.startHeartbeat()

    simpleLogger.info('WebSocket server iniciado', { port })
  }

  /**
   * Envia notificação para usuário específico
   */
  async sendToUser(userId: string, notification: NotificationData): Promise<boolean> {
    const connections = this.userConnections.get(userId)

    if (!connections || connections.size === 0) {
      simpleLogger.warn('Usuário não conectado via WebSocket', { userId })
      return false
    }

    const unreadCount = await getNotificationService().getUnreadCount(userId)

    const message: WebSocketMessage = {
      type: 'notification',
      data: {
        notification,
        unreadCount,
      } as NotificationSocketData,
      timestamp: Date.now(),
    }

    let sent = 0
    const deadConnections: WebSocket[] = []

    for (const ws of connections) {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message))
          sent++
        } else {
          deadConnections.push(ws)
        }
      } catch (_error) {
        simpleLogger.warn('Erro ao enviar para conexão WebSocket', { error, userId })
        deadConnections.push(ws)
      }
    }

    // Remove conexões mortas
    deadConnections.forEach(ws => {
      connections.delete(ws)
    })

    if (connections.size === 0) {
      this.userConnections.delete(userId)
    }

    simpleLogger.info('Notificação enviada via WebSocket', {
      userId,
      connections: sent,
      removedDead: deadConnections.length,
    })

    return sent > 0
  }

  /**
   * Envia notificação para múltiplos usuários
   */
  async sendToUsers(userIds: string[], notification: NotificationData): Promise<number> {
    let totalSent = 0

    for (const userId of userIds) {
      const sent = await this.sendToUser(userId, notification)
      if (sent) totalSent++
    }

    return totalSent
  }

  /**
   * Envia broadcast para todos os usuários conectados
   */
  async broadcast(message: WebSocketMessage): Promise<number> {
    let sent = 0
    const deadConnections: WebSocket[] = []

    for (const [userId, connections] of this.userConnections) {
      for (const ws of connections) {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message))
            sent++
          } else {
            deadConnections.push(ws)
          }
        } catch (_error) {
          simpleLogger.warn('Erro no broadcast WebSocket', { error, userId })
          deadConnections.push(ws)
        }
      }
    }

    // Limpa conexões mortas
    this.cleanDeadConnections(deadConnections)

    simpleLogger.info('Broadcast WebSocket enviado', {
      sent,
      totalConnections: this.getTotalConnections(),
    })

    return sent
  }

  /**
   * Notifica atualização de contagem não lidas
   */
  async notifyUnreadCountUpdate(userId: string): Promise<void> {
    try {
      const unreadCount = await getNotificationService().getUnreadCount(userId)

      const message: WebSocketMessage = {
        type: 'status',
        data: { unreadCount },
        timestamp: Date.now(),
      }

      await this.sendMessageToUser(userId, message)
    } catch (_error) {
      simpleLogger.error('Erro ao notificar contagem não lidas', { error: String(error), userId })
    }
  }

  /**
   * Obtém estatísticas do servidor
   */
  getStats() {
    return {
      totalConnections: this.getTotalConnections(),
      connectedUsers: this.userConnections.size,
      userConnections: Array.from(this.userConnections.entries()).map(([userId, connections]) => ({
        userId,
        connections: connections.size,
      })),
    }
  }

  /**
   * Para o servidor WebSocket
   */
  close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.wss.close()
    simpleLogger.info('WebSocket server fechado')
  }

  /**
   * Configura o servidor WebSocket
   */
  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request)
    })

    this.wss.on('error', error => {
      simpleLogger.error('Erro no WebSocket server', { error })
    })
  }

  /**
   * Trata nova conexão WebSocket
   */
  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const _userId = this.extractUserIdFromRequest(request)

    if (!userId) {
      simpleLogger.warn('Conexão WebSocket rejeitada - usuário não autenticado')
      ws.close(1008, 'Usuário não autenticado')
      return
    }

    // Adiciona à lista de conexões do usuário
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set())
    }
    this.userConnections.get(userId)!.add(ws)

    // Configura handlers da conexão
    ws.on('message', data => {
      this.handleMessage(ws, userId, Buffer.from(data as any))
    })

    ws.on('close', () => {
      this.handleDisconnection(ws, userId)
    })

    ws.on('error', error => {
      simpleLogger.warn('Erro na conexão WebSocket', { error, userId })
      this.handleDisconnection(ws, userId)
    })

    // Marca conexão como viva
    ;(ws as any).isAlive = true
    ws.on('pong', () => {
      ;(ws as any).isAlive = true
    })

    simpleLogger.info('Nova conexão WebSocket', {
      userId,
      totalConnections: this.getTotalConnections(),
    })

    // Envia contagem inicial de não lidas
    this.sendInitialData(ws, userId)
  }

  /**
   * Trata mensagens recebidas do cliente
   */
  private handleMessage(ws: WebSocket, userId: string, data: Buffer): void {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString())

      switch (message.type) {
        case 'ping':
          this.sendMessageToConnection(ws, {
            type: 'pong',
            timestamp: Date.now(),
          })
          break

        default:
          simpleLogger.warn('Tipo de mensagem WebSocket não reconhecido', {
            type: message.type,
            userId,
          })
      }
    } catch (_error) {
      simpleLogger.warn('Erro ao processar mensagem WebSocket', { error, userId })
    }
  }

  /**
   * Trata desconexão
   */
  private handleDisconnection(ws: WebSocket, userId: string): void {
    const connections = this.userConnections.get(userId)
    if (connections) {
      connections.delete(ws)
      if (connections.size === 0) {
        this.userConnections.delete(userId)
      }
    }

    simpleLogger.info('Conexão WebSocket fechada', {
      userId,
      totalConnections: this.getTotalConnections(),
    })
  }

  /**
   * Envia dados iniciais para nova conexão
   */
  private async sendInitialData(ws: WebSocket, userId: string): Promise<void> {
    try {
      const unreadCount = await getNotificationService().getUnreadCount(userId)

      const message: WebSocketMessage = {
        type: 'status',
        data: { unreadCount },
        timestamp: Date.now(),
      }

      this.sendMessageToConnection(ws, message)
    } catch (_error) {
      simpleLogger.error('Erro ao enviar dados iniciais', { error: String(error), userId })
    }
  }

  /**
   * Envia mensagem para usuário específico
   */
  private async sendMessageToUser(userId: string, message: WebSocketMessage): Promise<void> {
    const connections = this.userConnections.get(userId)
    if (!connections) return

    for (const ws of connections) {
      this.sendMessageToConnection(ws, message)
    }
  }

  /**
   * Envia mensagem para conexão específica
   */
  private sendMessageToConnection(ws: WebSocket, message: WebSocketMessage): void {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    } catch (_error) {
      simpleLogger.warn('Erro ao enviar mensagem WebSocket', { error })
    }
  }

  /**
   * Verifica se cliente pode se conectar
   */
  private verifyClient(info: { origin: string; secure: boolean; req: IncomingMessage }): boolean {
    // Implementar verificação de autenticação se necessário
    return true
  }

  /**
   * Extrai ID do usuário da requisição
   */
  private extractUserIdFromRequest(request: IncomingMessage): string | null {
    try {
      // Extrai do token de query string ou header
      const url = new URL(request.url || '', `http://${request.headers.host}`)
      const token = url.searchParams.get('token') || request.headers.authorization

      if (!token) return null

      // Aqui você implementaria a verificação do token JWT
      // Por simplicidade, assumindo que o token contém o userId
      // Em produção, verificar assinatura JWT

      // Mock implementation - substituir por verificação real do JWT
      const mockUserId = url.searchParams.get('userId')
      return mockUserId
    } catch (_error) {
      simpleLogger.warn('Erro ao extrair userId da requisição WebSocket', { error })
      return null
    }
  }

  /**
   * Inicia heartbeat para detectar conexões mortas
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const deadConnections: WebSocket[] = []

      for (const [userId, connections] of this.userConnections) {
        for (const ws of connections) {
          if (!(ws as any).isAlive) {
            deadConnections.push(ws)
            continue
          }

          ;(ws as any).isAlive = false
          try {
            ws.ping()
          } catch (_error) {
            deadConnections.push(ws)
          }
        }
      }

      this.cleanDeadConnections(deadConnections)
    }, 30000) // 30 segundos
  }

  /**
   * Remove conexões mortas
   */
  private cleanDeadConnections(deadConnections: WebSocket[]): void {
    for (const ws of deadConnections) {
      try {
        ws.terminate()
      } catch (_error) {
        // Ignora erros ao terminar conexão já morta
      }

      // Remove das listas de usuários
      for (const [userId, connections] of this.userConnections) {
        connections.delete(ws)
        if (connections.size === 0) {
          this.userConnections.delete(userId)
        }
      }
    }

    if (deadConnections.length > 0) {
      simpleLogger.info('Conexões mortas removidas', { count: deadConnections.length })
    }
  }

  /**
   * Obtém total de conexões ativas
   */
  private getTotalConnections(): number {
    let total = 0
    for (const connections of this.userConnections.values()) {
      total += connections.size
    }
    return total
  }
}

// Singleton instance
let wsServer: NotificationWebSocketServer | null = null

export function getWebSocketServer(): NotificationWebSocketServer {
  if (!wsServer) {
    wsServer = new NotificationWebSocketServer()
  }
  return wsServer
}

export function initWebSocketServer(port?: number): NotificationWebSocketServer {
  if (wsServer) {
    wsServer.close()
  }
  wsServer = new NotificationWebSocketServer(port)
  return wsServer
}
