  // auditLogger.getAuditStats não aceita filtros na implementação atual (stub),
  // portanto chamamos sem argumentos para compatibilidade.
  return auditLogger.getAuditStats?.() as any
  },
}

export default auditService
