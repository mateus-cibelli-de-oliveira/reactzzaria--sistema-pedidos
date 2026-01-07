import styled from "styled-components";
import Grid from "@mui/material/Grid";

const PizzasGrid = styled(Grid).attrs({
  container: true,
  spacing: 16,
})`
  && {
    padding: ${({ theme }) => theme.spacing(3)}px;
    justify-content: center;
  }
`;

export default PizzasGrid;
