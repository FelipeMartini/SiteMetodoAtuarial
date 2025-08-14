API mínima para cálculos atuariais

Endpoints:
- GET /api/atuarial/calcular?tipo=ping -> retorna { ok: true }
- GET /api/atuarial/calcular?tipo=expectativa_vida&idade=30 -> retorna expectativa de vida
- POST /api/atuarial/calcular -> body JSON { tipo: string, parametros: object }

Exemplo CURL:

```bash
curl -X POST 'http://localhost:3000/api/atuarial/calcular' \
  -H 'Content-Type: application/json' \
  -d '{"tipo":"expectativa_vida","parametros":{"idade":30}}'
```

Notas:
- Este endpoint usa a `CalculadoraAtuarial` do projeto e não salva resultados no banco (útil para integração frontend rápida).
- Tipos de `tipo` suportados: "premio_unico_vida", "renda_vitalicia", "reserva_matematica", "expectativa_vida", "probabilidade_sobrevivencia".
