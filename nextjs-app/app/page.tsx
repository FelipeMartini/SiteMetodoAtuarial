"use client";

// Página inicial moderna com novo sistema de temas
import React from 'react';
import Link from 'next/link';
import { Container, Flex, Texto, Secao, Card } from '../styles/ComponentesBase';
import { Botao } from './design-system/Botao';
import { CardInfo } from './design-system/CardInfo';
import { useTema } from './contexts/ThemeContext';

const services = [
  {
    titulo: 'Consultoria Atuarial',
    descricao: 'Análise de riscos e avaliação de passivos previdenciários',
    icone: '📊',
  },
  {
    titulo: 'Relatórios Regulatórios',
    descricao: 'Atendimento às normas SUSEP, PREVIC e outros órgãos',
    icone: '📋',
  },
  {
    titulo: 'Modelagem Matemática',
    descricao: 'Desenvolvimento de modelos atuariais customizados',
    icone: '🔢',
  },
];

export default function Home() {
  const { isDarkMode } = useTema();

  return (
    <Container>
      {/* Hero Section */}
      <Secao $padding="lg">
        <Flex $direction="column" $align="center" $gap="xl" style={{ textAlign: 'center' }}>
          <div>
            <Texto $variante="h1" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              Método Atuarial
            </Texto>
            <Texto $variante="h2" $cor="#666666" style={{ maxWidth: '600px' }}>
              Consultoria especializada em soluções atuariais, oferecendo excelência técnica
              e inovação para o mercado de previdência e seguros.
            </Texto>
          </div>

          <Flex $gap="md" $wrap>
            <Link href="/sobre" style={{ textDecoration: 'none' }}>
              <Botao variant="primary" size="lg">
                Conheça Nossa História
              </Botao>
            </Link>
            <Link href="/contato" style={{ textDecoration: 'none' }}>
              <Botao variant="secondary" size="lg">
                Solicitar Orçamento
              </Botao>
            </Link>
          </Flex>
        </Flex>
      </Secao>

      {/* Services Section */}
      <Secao $padding="lg">
        <Texto $variante="h2" $align="center" style={{ marginBottom: '3rem' }}>
          Nossos Serviços
        </Texto>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {services.map((service, index) => (
            <CardInfo
              key={index}
              titulo={service.titulo}
              descricao={service.descricao}
              icone={<span style={{ fontSize: '3rem' }}>{service.icone}</span>}
              elevacao={2}
              hover={true}
            />
          ))}
        </div>
      </Secao>

      {/* CTA Section */}
      <Secao $padding="lg">
        <Card $shadow style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <Flex $direction="column" $align="center" $gap="lg">
            <Texto $variante="h3" $peso="normal">
              Pronto para transformar seu negócio?
            </Texto>
            <Texto $cor="secundario">
              Entre em contato conosco e descubra como nossas soluções atuariais
              podem otimizar seus resultados e garantir conformidade regulatória.
            </Texto>
            <Link href="/contato" style={{ textDecoration: 'none' }}>
              <Botao variant="primary" size="lg">
                Fale Conosco
              </Botao>
            </Link>
          </Flex>
        </Card>
      </Secao>

      {/* Theme Demo */}
      <Secao $padding="sm">
        <Card $shadow style={{ textAlign: 'center' }}>
          <Texto $variante="caption" $cor="#888888">
            Tema atual: {isDarkMode ? 'Escuro 🌙' : 'Claro ☀️'}
          </Texto>
        </Card>
      </Secao>
    </Container>
  );
}
