// Componente para renderizar o ícone oficial da Apple
import React from 'react';
import Image from 'next/image';

const IconeApple: React.FC<{ tamanho?: number }> = ({ tamanho = 24 }) => (
  <Image
    src="/social/apple-logo.svg"
    alt="Apple"
    width={tamanho}
    height={tamanho}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    priority
  />
);

export default IconeApple;
