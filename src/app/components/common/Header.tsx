import { useSelector } from "@/app/store";
import palette from "@/app/styles/palette";
import styled, { css } from "styled-components";
import HeaderProfile from "./HeaderProfile";



interface StyledProps {
    $isDark: boolean;
}

const Container = styled.div<StyledProps>`
    ${(props) => 
        props.$isDark &&
        css`
            background-color: ${palette.dark} !important
            .home-button {
                background-color: ${palette.dark} !important;
            }
            a {
                color: ${palette.gray} !important;
            }import { commonAction } from '../../store/common';

        `}

    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
    position: relative;

    .inner {
        display: flex;
        max-width: 940px;
        margin: 0 auto;
        box-sizing: border-box;
        position: relative;
        padding-left: 20px;
        padding-right: 20px;

        @media only screen and (max-width: 768px) {
            width: 100%;
        }
    }

    .wrapper {
        display: block;
        justify-content: center;
        width: 25%;

        @media only screen and (max-width: 768px) {
            width: auto;
        }
    }

    .toggle-btn {
        background: url("../img/toggle_blue.svg");
        width: 27px;
        height: 18px;
        cursor: pointer;
        text-indent: -9999px;
        margin: 28px 0px;

        @media only screen and (max-width: 768px) {
            float: left;
        }
    }

    .title-group {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }
    .title-group .logo {
        background: url("../img/owl.svg");
        width: 36px;
        height: 36px;
        display: block;
        text-indent: -9999px;
    }
    .title-group a {
        display: block;
        padding: 21.5px 0;
        font-size: 24px;
        font-weight: bold;
        line-height: 29px;
        text-decoration: none;

        @media only screen and (max-width: 768px) {
            padding: 18px 0;
            font-size: 18px;
            font-weight: bold;
            line-height: 18px;
        }
    }

    .btn-group {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;

        @media only screen and (max-width: 768px) {
            margin-right: 0px;
        }
    }

    a {
        text-decoration: none;
        color: black;
    }

    .home-button {
        border: none;
        background-color: white;
    }
`

const Header = () => {
    const isDarkMode = useSelector((state)=> state.common.isDark);


    return (
        <>
        <Container $isDark={isDarkMode}>
            <div className="inner">
                <div className="wrapper">
                    Header Menu Button
                </div>
                <div className="title-group">
                    <div className="logo">부엉이</div>
                    <button className="home-button">
                        <a>부엉이 개발자</a>
                    </button>
                </div>
                <div className="btn-group">
                <HeaderProfile />
                </div>
            </div>
        </Container>
        </>
    )
}

export default Header;

