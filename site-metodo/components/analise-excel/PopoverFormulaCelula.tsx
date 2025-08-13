import React from 'react';

interface Props {
  valor: string | number | null;
  formula?: string | null;
}

export default function PopoverFormulaCelula({ valor, formula }: Props) {
  const [show, setShow] = React.useState(false);
  if (formula) {
    return (
      <span className="relative">
        <button
          className="underline text-blue-600"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {valor ?? ''}
        </button>
        {show && (
          <span className="absolute z-10 left-0 top-full bg-white border p-2 text-xs shadow">
            Fórmula: <span className="font-mono">{formula}</span>
          </span>
        )}
      </span>
    );
  }
  return <span>{valor ?? ''}</span>;
}
