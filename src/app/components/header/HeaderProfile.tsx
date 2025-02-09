"use client";

import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import UserProfile from "./UserProfile";



interface StyledProps {
  $isdark: boolean;
}

const media = {
  mobile: "@media only screen and (max-width: 768px)",
};

const buttonGroupStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.mobile} {
    width: 100%;
    float: right;
  }
`;

const userInfoStyles = css`
  border: 1px solid ${palette.green};
  border-radius: 50px;
  padding: 0 10px;
  width: auto;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;

  color: ${palette.black};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  ${media.mobile} {
    display: none;
  }
`;

const Container = styled.div<StyledProps>`
  ${(props) =>
    props.$isdark &&
    css`
      .userInfo {
        color: ${palette.gray} !important;
        cursor: pointer;
      }
    `}

  position: relative;

  .btn-group {
    ${buttonGroupStyles}
  }

  .userInfo {
    ${userInfoStyles}
  }

  .logout-button {
    ${media.mobile} {
      display: none;
    }
  }
`;


const HeaderProfile = () => {
  const isDarkMode = useSelector((state) => state.common.isDark);

  return (
    <Container $isdark={isDarkMode}>
      <div className="btn-group">
        <UserProfile />
      </div>
    </Container>
  );
};

export default HeaderProfile;
