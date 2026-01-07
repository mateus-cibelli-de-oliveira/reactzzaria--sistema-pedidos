import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import MaterialToolbar from "@mui/material/Toolbar";
import { CHECKOUT } from "@/routes";
import HeaderCommon from "./header-common";
import HeaderCheckout from "./header-checkout";

const Header = () => (
  <AppBar>
    <Toolbar>
      <Routes>
        <Route path={CHECKOUT} element={<HeaderCheckout />} />
        <Route path="*" element={<HeaderCommon />} />
      </Routes>
    </Toolbar>
  </AppBar>
);

const Toolbar = styled(MaterialToolbar)`
  && {
    margin: 0 auto;
    width: 100%;
    max-width: ${({ theme }) => theme.breakpoints.values.lg}px;
  }
`;

export default Header;
