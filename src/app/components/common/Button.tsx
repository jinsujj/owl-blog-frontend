import palette from "@/app/styles/palette";
import React from "react";
import styled, { css } from "styled-components";

interface StyledProps {
  width: string;
  color?: string;
  variant?: "default" | "outlined" | "text";
}

const Container = styled.button<StyledProps>`
  width: ${(props) => props.width};
  height: 40px;
  margin: 10px 5px;
  padding: 0 15px;
  border-radius: 4px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.variant === "default" &&
    css`
      background: ${props.color || palette.blue};
      color: white;
      border: none;

      &:hover {
        background: ${palette.blueHover};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    `}

  ${(props) =>
    props.variant === "outlined" &&
    css`
      background: transparent;
      color: ${props.color || palette.blue};
      border: 1px solid ${props.color || palette.blue};

      &:hover {
        background: ${props.color || palette.blue};
        color: white;
      }
    `}

  ${(props) =>
    props.variant === "text" &&
    css`
      background: transparent;
      color: ${props.color || palette.blue};
      border: none;

      &:hover {
        text-decoration: underline;
      }
    `}

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

interface IProps {
  children: React.ReactNode;
  width?: string;
  color?: string;
  variant?: "default" | "outlined" | "text"; // 스타일 옵션
  onClick?: () => void;
}

const Button = ({
  children,
  width = "130px",
  color = palette.blue,
  variant = "default",
  ...props
}: IProps) => {
  return (
    <Container {...props} width={width} color={color} variant={variant}>
      {children}
    </Container>
  );
};

export default Button;
