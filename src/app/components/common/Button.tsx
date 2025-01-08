import palette from "@/app/styles/palette";
import React from "react";
import styled from "styled-components";

interface StyledProps {
  width: string;
  color?: string;
}

const Container = styled.button<StyledProps>`
  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  width: ${(props) => props.width};
  height: 40px;
  padding: 0 16px;
  margin-right: 5px;
	margin-bottom: 10px;
	margin-top: 10px;

  border: 1px solid
    ${(props) => (props.color === "" ? palette.blue : props.color)};
  box-sizing: border-box;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  color: ${palette.blue};
  color: ${(props) => (props.color === "" ? palette.blue : "white")};
  background: ${(props) => (props.color === "" ? "white" : props.color)};
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background: ${(props) => (props.color === "" ? palette.blue : "white")};
    color: ${(props) => (props.color === "" ? "white" : props.color)};
  }
`;

interface IProps {
  children: React.ReactNode;
  width?: string;
  color?: string; 
  onClick?: () => void;
}

const Button = ({ children, width, color, ...props }: IProps) => {
  if (width === undefined) 
    width = "130px";

  return (
    <Container {...props} width={width} color={color}>
      {children}
    </Container>
  );
};

export default Button;
