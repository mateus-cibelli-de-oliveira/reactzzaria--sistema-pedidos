import { Link } from "react-router-dom";
import styled from "styled-components";
import { CardActionArea } from "@mui/material";

const CardLink = styled(CardActionArea).attrs({
  component: Link,
})`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${({ theme }) => theme.spacing(3, 0)};
    min-width: 250px;
  }
`;

export default CardLink
