// Componente CardInfo reutilizável do design system
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";

/**
 * CardInfo padronizado para exibir informações, já integrado ao tema.
 * Recebe título, descrição e children para conteúdo extra.
 */
interface CardInfoProps extends CardProps {
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
}

const CardInfo: React.FC<CardInfoProps> = ({ titulo, descricao, children, ...props }) => {
  return (
    <Card {...props} sx={{ borderRadius: 4, boxShadow: 3, ...props.sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{titulo}</Typography>
        {descricao && <Typography variant="body2" sx={{ mb: 2 }}>{descricao}</Typography>}
        {children}
      </CardContent>
    </Card>
  );
};

export default CardInfo;
