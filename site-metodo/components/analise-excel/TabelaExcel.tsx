import React from 'react';
import { PlanilhaExcel } from '@/types/analise-excel';
import PopoverFormulaCelula from './PopoverFormulaCelula';

interface Props {
  planilha: PlanilhaExcel;
}

export default function TabelaExcel({ planilha }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Célula</th>
            {planilha.colunas.map((col) => (
              <th key={col} className="border px-2 py-1">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planilha.linhas.map((linha, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1 font-bold">{linha.numero}</td>
              {linha.celulas.map((celula) => (
                <td key={celula.coluna} className="border px-2 py-1">
                  <PopoverFormulaCelula valor={celula.valor} formula={celula.formula} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
