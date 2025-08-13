// Página principal de análise de Excel
'use client';
import FormularioUploadExcel from '@/components/analise-excel/FormularioUploadExcel';
import AbasPlanilhaExcel from '@/components/analise-excel/AbasPlanilhaExcel';
import TabelaExcel from '@/components/analise-excel/TabelaExcel';
import { useState } from 'react';
import { DadosAnaliseExcel, PlanilhaExcel } from '@/types/analise-excel';

export default function PaginaAnaliseExcel() {
  const [dados, setDados] = useState<DadosAnaliseExcel | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<string | null>(null);

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Análise de Arquivo Excel</h1>
      <FormularioUploadExcel onAnaliseConcluida={setDados} />
      {dados && (
        <>
          <AbasPlanilhaExcel
            planilhas={dados.planilhas}
            abaAtiva={abaAtiva}
            onTrocarAba={setAbaAtiva}
          />
          {abaAtiva && (
            <TabelaExcel planilha={dados.planilhas.find(p => p.nome === abaAtiva)!} />
          )}
        </>
      )}
    </main>
  );
}
