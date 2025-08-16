"use client"

import ABACClient from './page-client'

export default function ABACPageClientWrapper() {
  // Renderiza o componente cliente ABAC; autenticação e permissões
  // devem ser tratadas no próprio componente cliente ou via middleware.
  return <ABACClient />
}
/*
  O resto do arquivo contia a versão client-side do admin ABAC com JSX e
  hooks. Foi comentado temporariamente para resolver um erro de sintaxe
  enquanto priorizamos correções transversais (logging, validação, etc).
  Se precisar restaurar a UI, recompor a partir do arquivo original ou mover
  para `page-client.tsx` e importar dinamicamente.
*/
