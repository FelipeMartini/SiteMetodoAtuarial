import React, { useMemo, useState } from 'react';
import type { PlanilhaExcel } from '@/types/analise-excel';


interface Props {
  planilha: PlanilhaExcel;
}


const LINHAS_POR_PAGINA = 50;

function exportarParaCSV(planilha: PlanilhaExcel) {
  const linhas = [
    ['Linha', ...planilha.colunas.flatMap(col => [col + ' (Valor)', col + ' (Fórmula)'])],
    ...planilha.linhas.map(linha => [
      linha.numero,
      ...linha.celulas.flatMap(celula => [celula.valor ?? '', celula.formula ?? ''])
    ])
  ];
  return linhas.map(l => l.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
}

function exportarParaJSON(planilha: PlanilhaExcel) {
  return JSON.stringify(planilha, null, 2);
}

export default function TabelaExcel({ planilha }: Props) {
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');

  const linhasFiltradas = useMemo(() => {
    if (!busca) return planilha.linhas;
    const buscaLower = busca.toLowerCase();
    return planilha.linhas.filter(linha =>
      linha.celulas.some(celula =>
        (celula.valor && String(celula.valor).toLowerCase().includes(buscaLower)) ||
        (celula.formula && celula.formula.toLowerCase().includes(buscaLower))
      )
    );
  }, [busca, planilha.linhas]);

  const linhasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * LINHAS_POR_PAGINA;
    return linhasFiltradas.slice(inicio, inicio + LINHAS_POR_PAGINA);
  }, [pagina, linhasFiltradas]);

  function handleDownload(tipo: 'csv' | 'json') {
    const blob = new Blob([
      tipo === 'csv' ? exportarParaCSV(planilha) : exportarParaJSON(planilha)
    ], { type: tipo === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planilha-${planilha.nome}.${tipo}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div className="flex gap-2">
          <button onClick={() => handleDownload('csv')} className="btn btn-sm btn-outline">Baixar CSV</button>
          <button onClick={() => handleDownload('json')} className="btn btn-sm btn-outline">Baixar JSON</button>
        </div>
        <input
          type="text"
          placeholder="Buscar valor ou fórmula..."
          value={busca}
          onChange={e => { setBusca(e.target.value); setPagina(1); }}
          className="input input-bordered input-sm w-full md:w-64"
        />
      </div>
      <table className="min-w-full border text-xs md:text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Linha</th>
            {planilha.colunas.map((col) => (
              <th key={col} colSpan={2} className="border px-2 py-1 text-center">{col}</th>
            ))}
          </tr>
          <tr>
            <th></th>
            {planilha.colunas.map((col) => [
              <th key={col + '-valor'} className="border px-2 py-1">Valor</th>,
              <th key={col + '-formula'} className="border px-2 py-1">Fórmula</th>
            ])}
          </tr>
        </thead>
        <tbody>
          {linhasPaginadas.map((linha, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1 font-bold text-center">{linha.numero}</td>
              {linha.celulas.map((celula, i) => [
                <td key={i + '-valor'} className="border px-2 py-1">{celula.valor ?? ''}</td>,
                <td key={i + '-formula'} className="border px-2 py-1 font-mono text-xs text-blue-700">{celula.formula ?? ''}</td>
              ])}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs">{linhasFiltradas.length} linhas encontradas</span>
        <div className="flex gap-1">
          <button
            className="btn btn-xs btn-outline"
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >Anterior</button>
          <span className="px-2">Página {pagina} de {Math.max(1, Math.ceil(linhasFiltradas.length / LINHAS_POR_PAGINA))}</span>
          <button
            className="btn btn-xs btn-outline"
            onClick={() => setPagina(p => Math.min(Math.ceil(linhasFiltradas.length / LINHAS_POR_PAGINA), p + 1))}
            disabled={pagina === Math.ceil(linhasFiltradas.length / LINHAS_POR_PAGINA) || linhasFiltradas.length === 0}
          >Próxima</button>
        </div>
      </div>
    </div>
  );
}
