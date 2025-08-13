import React, { useRef, useState } from 'react';
import type { DadosAnaliseExcel } from '@/types/analise-excel';

interface Props {
  onAnaliseConcluida: (dados: DadosAnaliseExcel) => void;
}

export default function FormularioUploadExcel({ onAnaliseConcluida }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!inputRef.current?.files?.[0]) return;
    setCarregando(true);
    const formData = new FormData();
    formData.append('file', inputRef.current.files[0]);
    try {
      const resp = await fetch('/api/analise-excel', {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) throw new Error('Falha ao analisar arquivo');
      const dados = await resp.json();
      onAnaliseConcluida(dados);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="mb-6 flex flex-col gap-2">
      <input type="file" accept=".xlsx,.xls" ref={inputRef} required />
      <button type="submit" className="btn btn-primary" disabled={carregando}>
        {carregando ? 'Analisando...' : 'Enviar e Analisar'}
      </button>
      {erro && <span className="text-red-500">{erro}</span>}
    </form>
  );
}
