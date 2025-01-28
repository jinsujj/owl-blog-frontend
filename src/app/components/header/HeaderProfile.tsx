import React from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useSelector } from "../../store";
import { commonAction } from "../../store/common";
import palette from "../../styles/palette";
import Button from "../common/Button";
import Router from "next/router";


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
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.common.postState);
  const isDarkMode = useSelector((state) => state.common.isDark);

  const onClickPostBlog = () => {
    if (postState === "modify" || postState === "published") {
      dispatch(commonAction.setPostState("created"));
      Router.push("../");
    }
  };


  return (
    <Container $isdark={isDarkMode}>
      <div className="btn-group">
        {postState === "created" && (
          <Button onClick={onClickPostBlog} width="110px" color={palette.green}>
            Edit
          </Button>
        )}
        {postState !== "published" && (
          <Button onClick={onClickPostBlog} width="110px" color={palette.green}>
            Write
          </Button>
        )}
        {postState !== "created" && (
          <Button onClick={onClickPostBlog} width="110px" color={palette.green}>
            Back
          </Button>
        )}
      </div>
    </Container>
  );
};

export default HeaderProfile;
