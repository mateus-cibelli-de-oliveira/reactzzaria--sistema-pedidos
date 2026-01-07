import { Typography } from "@mui/material";

/**
 * Estilos base compartilhados
 * Não definem hierarquia tipográfica (h3, h4, h6 etc.)
 */
const baseTypographyStyle = (theme) => ({
  lineHeight: 1.2,
  marginBottom: theme.spacing(2),
});

/**
 * Headings semânticos
 */
export const H3 = ({ sx, ...props }) => (
  <Typography
    variant="h3"
    sx={(theme) => ({
      ...baseTypographyStyle(theme),
      fontSize: theme.typography.h3.fontSize,
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.5rem",
      },
      ...sx,
    })}
    {...props}
  />
);

export const H4 = ({ sx, ...props }) => (
  <Typography
    variant="h4"
    sx={(theme) => ({
      ...baseTypographyStyle(theme),
      fontSize: theme.typography.h4.fontSize,
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.25rem",
      },
      ...sx,
    })}
    {...props}
  />
);

export const H6 = ({ sx, ...props }) => (
  <Typography
    variant="h6"
    sx={(theme) => ({
      ...baseTypographyStyle(theme),
      fontSize: theme.typography.h6.fontSize,
      [theme.breakpoints.down("sm")]: {
        fontSize: "1rem",
      },
      ...sx,
    })}
    {...props}
  />
);

/**
 * Componentes de domínio
 */
export const PizzaName = (props) => (
  <Typography variant="h5" {...props} />
);
