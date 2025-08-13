import React from 'react';
import type { PlanilhaExcel } from '@/types/analise-excel';

interface Props {
  planilhas: PlanilhaExcel[];
  abaAtiva: string | null;
  onTrocarAba: (nome: string) => void;
}

export default function AbasPlanilhaExcel({ planilhas, abaAtiva, onTrocarAba }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {planilhas.map((p) => (
        <button
          key={p.nome}
          className={`px-4 py-2 rounded ${abaAtiva === p.nome ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => onTrocarAba(p.nome)}
        >
          {p.nome}
        </button>
      ))}
    </div>
  );
}
