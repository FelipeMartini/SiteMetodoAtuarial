// Componente reutilizável para botões de login social
import React from 'react';

interface BotaoSocialProps {
  icone: React.ReactNode;
  texto: string;
  corFundo: string;
  corTexto: string;
  onClick: () => void;
  borderColor?: string;
  fontFamily?: string;
}

// Este componente não é mais necessário, pois usamos apenas as imagens oficiais dos botões.
// Mantido apenas para compatibilidade com testes existentes.

export default function BotaoSocial(props: BotaoSocialProps) {
  return (
    <button onClick={props.onClick}>
      {props.icone}
      {props.texto}
    </button>
  );
}
