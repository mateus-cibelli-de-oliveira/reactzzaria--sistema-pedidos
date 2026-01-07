import styled from "styled-components";
import MainLogo from "@/assets/logo-react-zzaria.svg";

const Logo = styled.img.attrs({
  src: MainLogo,
  alt: "Logo"
})`
  height: 50px;
  width: 200px;
  filter: brightness(0) invert(1);
`;

export default Logo;
