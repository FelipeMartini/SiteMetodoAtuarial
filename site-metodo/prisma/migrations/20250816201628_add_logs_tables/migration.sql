-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "module" TEXT,
    "operation" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "correlationId" TEXT,
    "metadata" JSONB,
    "error" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "duration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "system_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "correlationId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "performance_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operation" TEXT NOT NULL,
    "method" TEXT,
    "path" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "correlationId" TEXT,
    "duration" INTEGER NOT NULL,
    "memoryUsage" INTEGER,
    "cpuUsage" REAL,
    "dbQueries" INTEGER,
    "cacheHits" INTEGER,
    "cacheMisses" INTEGER,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "performance_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "massa_participantes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matricula" TEXT NOT NULL,
    "nome" TEXT,
    "sexo" INTEGER NOT NULL,
    "idade" INTEGER NOT NULL,
    "dataNascimento" DATETIME,
    "anoIngressao" INTEGER NOT NULL,
    "anoCadastro" INTEGER NOT NULL,
    "categoria" TEXT,
    "salario" REAL,
    "situacao" TEXT DEFAULT 'ATIVO',
    "dataUltimaAtu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importacaoId" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "massa_participantes_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "importacoes_mortalidade" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "obitos_registrados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matricula" TEXT NOT NULL,
    "participanteId" TEXT,
    "anoObito" INTEGER NOT NULL,
    "mesObito" INTEGER,
    "idadeObito" INTEGER NOT NULL,
    "causaObito" TEXT,
    "tipoObito" TEXT DEFAULT 'NATURAL',
    "dataRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importacaoId" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "obitos_registrados_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "massa_participantes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "obitos_registrados_importacaoId_fkey" FOREIGN KEY ("importacaoId") REFERENCES "importacoes_mortalidade" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tabuas_mortalidade_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "anoBase" INTEGER NOT NULL,
    "origem" TEXT,
    "tipo" TEXT DEFAULT 'VIDA',
    "populacao" TEXT,
    "observacoes" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "qx_mortalidade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tabuaId" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "qxMasculino" REAL,
    "qxFeminino" REAL,
    "qxGeral" REAL,
    "lxMasculino" REAL,
    "lxFeminino" REAL,
    "lxGeral" REAL,
    "exMasculino" REAL,
    "exFeminino" REAL,
    "exGeral" REAL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "qx_mortalidade_tabuaId_fkey" FOREIGN KEY ("tabuaId") REFERENCES "tabuas_mortalidade_ref" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analises_aderencia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tabuaRefId" TEXT NOT NULL,
    "tipoAnalise" TEXT NOT NULL DEFAULT 'CHI_QUADRADO',
    "nivelSignificancia" REAL NOT NULL DEFAULT 0.05,
    "intervalIdade" INTEGER NOT NULL DEFAULT 5,
    "idadeMinima" INTEGER,
    "idadeMaxima" INTEGER,
    "agruparPorSexo" BOOLEAN NOT NULL DEFAULT true,
    "configuracao" JSONB,
    "resultado" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataExecucao" DATETIME,
    "tempoProcessamento" INTEGER,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "analises_aderencia_tabuaRefId_fkey" FOREIGN KEY ("tabuaRefId") REFERENCES "tabuas_mortalidade_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "calculos_mortalidade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analiseId" TEXT NOT NULL,
    "participanteId" TEXT,
    "obitoId" TEXT,
    "faixaEtaria" TEXT NOT NULL,
    "sexo" INTEGER NOT NULL,
    "idade" INTEGER NOT NULL,
    "qxEsperado" REAL NOT NULL,
    "qxObservado" REAL,
    "obitosEsperados" REAL NOT NULL,
    "obitosObservados" INTEGER NOT NULL,
    "contribuicaoChiQuad" REAL,
    "residuoPadronizado" REAL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "calculos_mortalidade_analiseId_fkey" FOREIGN KEY ("analiseId") REFERENCES "analises_aderencia" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "calculos_mortalidade_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "massa_participantes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "calculos_mortalidade_obitoId_fkey" FOREIGN KEY ("obitoId") REFERENCES "obitos_registrados" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "relatorios_aderencia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analiseId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'COMPLETO',
    "formato" TEXT NOT NULL DEFAULT 'PDF',
    "conteudo" JSONB,
    "caminhoArquivo" TEXT,
    "tamanhoArquivo" INTEGER,
    "geradoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baixadoEm" DATETIME,
    "userId" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "relatorios_aderencia_analiseId_fkey" FOREIGN KEY ("analiseId") REFERENCES "analises_aderencia" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "importacoes_mortalidade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeArquivo" TEXT NOT NULL,
    "tipoArquivo" TEXT NOT NULL DEFAULT 'EXCEL',
    "tamanhoArquivo" INTEGER NOT NULL,
    "caminhoArquivo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "totalRegistros" INTEGER,
    "registrosImportados" INTEGER,
    "registrosErro" INTEGER,
    "logImportacao" JSONB,
    "iniciadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concluidaEm" DATETIME,
    "tempoProcessamento" INTEGER,
    "userId" TEXT,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "push_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "icon" TEXT,
    "badge" TEXT,
    "image" TEXT,
    "data" JSONB,
    "actions" JSONB,
    "tag" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "requireInteraction" BOOLEAN NOT NULL DEFAULT false,
    "silent" BOOLEAN NOT NULL DEFAULT false,
    "vibrate" JSONB,
    "scheduleTime" DATETIME,
    "expiresAt" DATETIME,
    "messageId" TEXT NOT NULL,
    "correlationId" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "push_deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notificationId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "errorMessage" TEXT,
    "httpStatus" INTEGER,
    "sentAt" DATETIME,
    "deliveredAt" DATETIME,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "nextRetryAt" DATETIME,
    "correlationId" TEXT,
    "duration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "push_deliveries_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "push_notifications" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "push_deliveries_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "push_subscriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "push_broadcasts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notificationId" TEXT NOT NULL,
    "targetUserIds" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalTargets" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "duration" INTEGER,
    "errorMessage" TEXT,
    "correlationId" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "push_broadcasts_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "push_notifications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE INDEX "system_logs_module_idx" ON "system_logs"("module");

-- CreateIndex
CREATE INDEX "system_logs_operation_idx" ON "system_logs"("operation");

-- CreateIndex
CREATE INDEX "system_logs_correlationId_idx" ON "system_logs"("correlationId");

-- CreateIndex
CREATE INDEX "system_logs_createdAt_idx" ON "system_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_correlationId_idx" ON "audit_logs"("correlationId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "performance_logs_operation_idx" ON "performance_logs"("operation");

-- CreateIndex
CREATE INDEX "performance_logs_duration_idx" ON "performance_logs"("duration");

-- CreateIndex
CREATE INDEX "performance_logs_createdAt_idx" ON "performance_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "massa_participantes_matricula_key" ON "massa_participantes"("matricula");

-- CreateIndex
CREATE INDEX "massa_participantes_sexo_idade_idx" ON "massa_participantes"("sexo", "idade");

-- CreateIndex
CREATE INDEX "massa_participantes_situacao_idx" ON "massa_participantes"("situacao");

-- CreateIndex
CREATE INDEX "massa_participantes_anoIngressao_idx" ON "massa_participantes"("anoIngressao");

-- CreateIndex
CREATE INDEX "obitos_registrados_anoObito_idx" ON "obitos_registrados"("anoObito");

-- CreateIndex
CREATE INDEX "obitos_registrados_idadeObito_idx" ON "obitos_registrados"("idadeObito");

-- CreateIndex
CREATE INDEX "obitos_registrados_matricula_idx" ON "obitos_registrados"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "tabuas_mortalidade_ref_nome_key" ON "tabuas_mortalidade_ref"("nome");

-- CreateIndex
CREATE INDEX "qx_mortalidade_idade_idx" ON "qx_mortalidade"("idade");

-- CreateIndex
CREATE UNIQUE INDEX "qx_mortalidade_tabuaId_idade_key" ON "qx_mortalidade"("tabuaId", "idade");

-- CreateIndex
CREATE INDEX "analises_aderencia_status_idx" ON "analises_aderencia"("status");

-- CreateIndex
CREATE INDEX "analises_aderencia_dataExecucao_idx" ON "analises_aderencia"("dataExecucao");

-- CreateIndex
CREATE INDEX "calculos_mortalidade_analiseId_idx" ON "calculos_mortalidade"("analiseId");

-- CreateIndex
CREATE INDEX "calculos_mortalidade_faixaEtaria_idx" ON "calculos_mortalidade"("faixaEtaria");

-- CreateIndex
CREATE INDEX "calculos_mortalidade_sexo_idx" ON "calculos_mortalidade"("sexo");

-- CreateIndex
CREATE INDEX "relatorios_aderencia_analiseId_idx" ON "relatorios_aderencia"("analiseId");

-- CreateIndex
CREATE INDEX "relatorios_aderencia_tipo_idx" ON "relatorios_aderencia"("tipo");

-- CreateIndex
CREATE INDEX "importacoes_mortalidade_status_idx" ON "importacoes_mortalidade"("status");

-- CreateIndex
CREATE INDEX "importacoes_mortalidade_iniciadaEm_idx" ON "importacoes_mortalidade"("iniciadaEm");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "push_subscriptions"("endpoint");

-- CreateIndex
CREATE INDEX "push_subscriptions_userId_idx" ON "push_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "push_subscriptions_isActive_idx" ON "push_subscriptions"("isActive");

-- CreateIndex
CREATE INDEX "push_subscriptions_createdAt_idx" ON "push_subscriptions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "push_notifications_messageId_key" ON "push_notifications"("messageId");

-- CreateIndex
CREATE INDEX "push_notifications_priority_idx" ON "push_notifications"("priority");

-- CreateIndex
CREATE INDEX "push_notifications_scheduleTime_idx" ON "push_notifications"("scheduleTime");

-- CreateIndex
CREATE INDEX "push_notifications_expiresAt_idx" ON "push_notifications"("expiresAt");

-- CreateIndex
CREATE INDEX "push_notifications_createdAt_idx" ON "push_notifications"("createdAt");

-- CreateIndex
CREATE INDEX "push_notifications_messageId_idx" ON "push_notifications"("messageId");

-- CreateIndex
CREATE INDEX "push_deliveries_status_idx" ON "push_deliveries"("status");

-- CreateIndex
CREATE INDEX "push_deliveries_sentAt_idx" ON "push_deliveries"("sentAt");

-- CreateIndex
CREATE INDEX "push_deliveries_nextRetryAt_idx" ON "push_deliveries"("nextRetryAt");

-- CreateIndex
CREATE INDEX "push_deliveries_notificationId_idx" ON "push_deliveries"("notificationId");

-- CreateIndex
CREATE INDEX "push_deliveries_subscriptionId_idx" ON "push_deliveries"("subscriptionId");

-- CreateIndex
CREATE INDEX "push_broadcasts_status_idx" ON "push_broadcasts"("status");

-- CreateIndex
CREATE INDEX "push_broadcasts_startedAt_idx" ON "push_broadcasts"("startedAt");

-- CreateIndex
CREATE INDEX "push_broadcasts_completedAt_idx" ON "push_broadcasts"("completedAt");

-- CreateIndex
CREATE INDEX "push_broadcasts_createdBy_idx" ON "push_broadcasts"("createdBy");
