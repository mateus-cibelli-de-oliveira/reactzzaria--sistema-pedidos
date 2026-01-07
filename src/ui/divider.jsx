import styled from "styled-components";
import MaterialDivider from "@mui/material/Divider";

const Divider = styled(MaterialDivider)`
  && {
    margin: ${({ theme }) => theme.spacing(3, 0)};
    width: 100%;
  }
`;

export default Divider;
