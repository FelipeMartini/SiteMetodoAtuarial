"use client";

import React from "react";

interface CheckboxCustomProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

const CheckboxCustom: React.FC<CheckboxCustomProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        style={{ accentColor: checked ? "#4F46E5" : "#ccc", width: 18, height: 18 }}
      />
      <span style={{ fontWeight: 500 }}>{label}</span>
    </label>
  );
};

export default CheckboxCustom;
// Comentário: Checkbox customizado para seleção de usuários, ativação/desativação e múltiplas ações no dashboard administrativo.
