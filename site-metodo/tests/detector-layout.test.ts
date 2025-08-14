import fs from 'fs'
import path from 'path'
import { detectarLayout } from '@/lib/aderencia/detector-layout'

describe('detector-layout', () => {
  it('detecta colunas em arquivo CSV simples', async () => {
    const sample = 'matricula,sexo,idade\n123,M,45\n124,F,50\n'
    const buffer = Buffer.from(sample, 'utf8')
    const resultado = await detectarLayout(buffer, 'teste.csv')
    expect(resultado).toHaveProperty('mapeamentoDetectado')
    expect(resultado).toHaveProperty('previewNormalizado')
    expect(resultado.confianca).toBeGreaterThanOrEqual(0)
  })
})
