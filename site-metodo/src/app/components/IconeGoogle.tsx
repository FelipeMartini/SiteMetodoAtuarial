// Componente para renderizar o ícone oficial do Google G
import React from 'react';
import Image from 'next/image';

const IconeGoogle: React.FC<{ tamanho?: number }> = ({ tamanho = 24 }) => (
  <Image
    src="/social/google-g-logo.png"
    alt="Google"
    width={tamanho}
    height={tamanho}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    priority
  />
);

export default IconeGoogle;
