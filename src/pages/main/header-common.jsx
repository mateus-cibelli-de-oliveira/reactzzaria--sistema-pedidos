import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useAuth } from "@/hooks";
import { HOME } from "@/routes";
import Logo from "./logo";

function HeaderCommon() {
  const [AnchorElement, setAnchorElement] = useState(null);
  const { loading, firstName, logout } = useAuth();

  if (loading) return null;

  const handleOpenMenu = (e) => {
    setAnchorElement(e.currentTarget);
  }

  const handleClose = () => {
    setAnchorElement(null);
  }

  return (
    <>
      <LogoContainer>
        <LinkLogo to={HOME}>
          <Logo />
        </LinkLogo>
      </LogoContainer>
      <Typography color="inherit" sx={{ mr: 1 }}>
        Olá, {firstName} :)
      </Typography>
      <IconButton color="inherit" onClick={handleOpenMenu}>
        <AccountCircle />
      </IconButton>
      <Menu
        open={Boolean(AnchorElement)}
        onClose={handleClose}
        anchorEl={AnchorElement}
        anchorOrigin={{
        vertical: "bottom"
        }}
        transformOrigin={{
          vertical: "top"
        }}
        PaperProps={{
          sx: {
            mt: 0.6,
            ml: 0.1
          }
        }}
      >
        <MenuItem onClick={logout}>Sair</MenuItem>
      </Menu>
    </>
  );
}

const LogoContainer = styled.div`
  flex-grow: 1;
`;

const LinkLogo = styled(Link)`
  display: inline-block;
`;

export default HeaderCommon;
