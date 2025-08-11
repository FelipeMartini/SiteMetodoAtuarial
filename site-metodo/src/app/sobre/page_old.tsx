'use client'

// 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
// Importações individuais do Material-UI para melhor performance e evitar duplicidade
import React from 'react'
// import { ErrorBoundary } from '../components/ErrorBoundary';
// Página Sobre - Inspirada no site métodoatuarial.com.br
// Apresenta informações institucionais, equipe e ambiente
// Removido import agrupado do MUI para evitar duplicidade
// import { Container, Typography, Box } from "@mui/material";

import Image from 'next/image'

// Todos os styled-components removidos. Use Tailwind nas tags diretamente.

// Memoização do componente para evitar renderizações desnecessárias
const Sobre: React.FC = React.memo(function Sobre() {
  // Renderização direta das imagens, sem Suspense
  return (
    <div className='w-full max-w-5xl mx-auto p-8 flex flex-col gap-8 bg-background text-foreground'>
      <h1 className='text-4xl font-bold mb-6 text-center text-primary drop-shadow'>
        Sobre a Método Atuarial
      </h1>
      <p className='text-lg mb-8 text-center text-muted-foreground'>
        Com mais de uma década de atuação, a Método Atuarial é referência nacional em consultoria
        atuarial, oferecendo soluções precisas, personalizadas e inovadoras para empresas de todos
        os portes. Nossa equipe é formada por atuários certificados, que aplicam metodologias
        avançadas e utilizam tecnologia de ponta para garantir máxima precisão nos cálculos,
        projeções e relatórios. Atuamos com ética, transparência e compromisso, sempre focados em
        superar as expectativas dos nossos clientes e contribuir para o sucesso sustentável de cada
        organização atendida.
      </p>
      {/* Imagem institucional sem Suspense */}
      <Image
        src='/office-team.png'
        alt='Equipe Método Atuarial'
        width={800}
        height={400}
        style={{ width: '100%', height: 'auto', borderRadius: 16, margin: '0 auto' }}
        priority
      />
      <div className='flex gap-8 mb-8 flex-wrap justify-center'>
        <div className='text-center min-w-[120px]'>
          <div className='text-3xl font-bold text-primary'>55+</div>
          <div className='text-base text-muted-foreground'>Empresas atendidas</div>
        </div>
        <div className='text-center min-w-[120px]'>
          <div className='text-3xl font-bold text-primary'>10+</div>
          <div className='text-base text-muted-foreground'>Anos de experiência</div>
        </div>
        <div className='text-center min-w-[120px]'>
          <div className='text-3xl font-bold text-primary'>100%</div>
          <div className='text-base text-muted-foreground'>Satisfação do cliente</div>
        </div>
      </div>
      <div className='flex flex-wrap gap-6 justify-center mt-8'>
        <Image
          src='/office-team.png'
          alt='Equipe Método Atuarial'
          width={220}
          height={147}
          style={{ borderRadius: 16, objectFit: 'cover' }}
          loading='lazy'
          quality={85}
          role='img'
          aria-label='Foto da equipe Método Atuarial'
        />
        <Image
          src='/office-1.png'
          alt='Recepção'
          width={220}
          height={147}
          style={{ borderRadius: 16, objectFit: 'cover' }}
          loading='lazy'
          quality={85}
          role='img'
          aria-label='Foto da recepção'
        />
        <Image
          src='/office-2.png'
          alt='Sala de Reuniões'
          width={220}
          height={147}
          style={{ borderRadius: 16, objectFit: 'cover' }}
          loading='lazy'
          quality={85}
          role='img'
          aria-label='Foto da sala de reuniões'
        />
        <Image
          src='/office-3.png'
          alt='Área de Trabalho'
          width={220}
          height={147}
          style={{ borderRadius: 16, objectFit: 'cover' }}
          loading='lazy'
          quality={85}
          role='img'
          aria-label='Foto da área de trabalho'
        />
      </div>
      {/* Comentário: Todas as cores da página Sobre agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
    </div>
  )
})
export default Sobre
