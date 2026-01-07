import Grid from "@mui/material/Grid";
import t from "prop-types";

const HeaderContent = ({ children }) => (
  <Grid container direction="column" alignItems="center">
    {children}
  </Grid>
);

HeaderContent.propTypes = {
  children: t.node.isRequired
}

export default HeaderContent;
