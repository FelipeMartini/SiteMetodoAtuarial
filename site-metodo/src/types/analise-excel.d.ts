export interface DadosAnaliseExcel {
  planilhas: PlanilhaExcel[];
}

export interface PlanilhaExcel {
  nome: string;
  colunas: string[];
  linhas: LinhaExcel[];
}

export interface LinhaExcel {
  numero: number;
  celulas: CelulaExcel[];
}

export interface CelulaExcel {
  coluna: string;
  valor: string | number | null;
  formula?: string | null;
}
