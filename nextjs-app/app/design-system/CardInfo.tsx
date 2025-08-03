// Componente CardInfo reutilizável do design system
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";

/**
 * CardInfo padronizado para exibir informações, já integrado ao tema.
 * Recebe título, descrição e children para conteúdo extra.
 *
 * @example
 * // Exemplo de uso:
 * <CardInfo titulo="Informações" descricao="Descrição opcional">
 *   <div>Conteúdo adicional</div>
 * </CardInfo>
 *
 * @param titulo Título principal do card.
 * @param descricao Texto opcional abaixo do título.
 * @param children Elementos filhos exibidos dentro do card.
 * @param props Props do Card do Material-UI, como sx, elevation, etc.
 *
 * O componente CardInfo utiliza o Card do Material-UI, facilitando a exibição de informações padronizadas e integradas ao tema.
 */
interface CardInfoProps extends CardProps {
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
}

// Memoização do componente para evitar renderizações desnecessárias quando as props não mudam
const CardInfo: React.FC<CardInfoProps> = React.memo(({ titulo, descricao, children, ...props }) => {
  return (
    <Card {...props} sx={{ borderRadius: 4, boxShadow: 3, ...props.sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{titulo}</Typography>
        {descricao && <Typography variant="body2" sx={{ mb: 2 }}>{descricao}</Typography>}
        {children}
      </CardContent>
    </Card>
  );
});

export default CardInfo;
