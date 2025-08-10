# AVISO DE SEGURANÇA: xlsx (SheetJS)

O pacote xlsx (SheetJS) utilizado no projeto está vulnerável a Prototype Pollution (CVE-2023-30533) e ReDoS (CVE-2024-22363) em todas as versões publicadas no npm.

## Contexto de Uso
- O uso atual é restrito à exportação de dados para Excel, sem leitura de arquivos externos.
- O risco é considerado baixo neste cenário, pois os ataques dependem da leitura de arquivos maliciosos.

## Recomendações
- Nunca utilize o xlsx para ler arquivos Excel de fontes não confiáveis.
- Considere migrar para alternativas como exceljs ou importar SheetJS diretamente do CDN oficial para obter versões corrigidas.
- Acompanhe atualizações em https://docs.sheetjs.com/ e https://cdn.sheetjs.com/advisories/

## Referências
- https://cdn.sheetjs.com/advisories/CVE-2023-30533
- https://cdn.sheetjs.com/advisories/CVE-2024-22363
- https://git.sheetjs.com/sheetjs/sheetjs/issues/2667
