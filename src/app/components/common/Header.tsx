import { setDarkMode, useSelector } from "@/app/store";
import palette from "@/app/styles/palette";
import styled, { css } from "styled-components";
import Link from "next/link";
import HeaderProfile from "./HeaderProfile";
import { useDispatch } from "react-redux";
import { RiKakaoTalkFill } from "react-icons/ri";
import { HiOutlineMoon, HiOutlineSun, HiOutlineBell } from "react-icons/hi2";

interface StyledProps {
    $isDark: boolean;
}

const Container = styled.div<StyledProps>`
  ${(props) =>
    props.$isDark &&
    css`
      background-color: ${palette.dark};
      a {
        color: ${palette.gray};
      }
    `}

  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const Inner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between; /* 영역을 3개로 나누기 위해 사용 */
	max-width: 1400px;
	margin: 0 auto;
	padding: 5px 20px;
	box-sizing: border-box;

	@media only screen and (max-width: 768px) {
		flex-wrap: wrap;
	}
`;

const Left = styled.div`
	align-items: center;
	gap: 10px;
`;

const Center = styled.div<StyledProps>`
	display: flex;
	justify-content: center;
	align-items: center;

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;

		.logo-icon {
			background: url("../img/owl.svg") no-repeat center/contain;
			width: 36px;
			height: 36px;
		}

		.logo-text {
			font-size: 20px;
			font-weight: bold;
			color: ${(props) => (props.$isDark ? "#fff" : "#333")};
		}
	}
`;

const Right = styled.div<StyledProps>`
	padding-right: 20px;
	display: flex;
	align-items: center;
	gap: 8px; /* 버튼 간 간격 */

	.home-button {
		display: flex;
		align-items: center;
		background-color: ${(props) => (props.$isDark ? palette.gray : "#fff")};
		color: ${(props) => (props.$isDark ? "#fff" : "#333")};
		border: none;
		padding: 8px 15px;
		border-radius: 5px;
		cursor: pointer;

		&:hover {
			background-color: ${(props) => (props.$isDark ? "#555" : "#e0e0e0")};
		}

		a {
			text-decoration: none;
			color: inherit;
			font-size: 16px;
			font-weight: bold;
		}
	}
`;

const IconButton = styled.button<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$isDark ? "#1e1e1e" : "#f9f9f9"}; /* 평소 배경색 */
  color: ${(props) => (props.$isDark ? "#fff" : "#333")};
  cursor: pointer;

  transition: background-color 0.3s ease, transform 0.2s ease; /* 애니메이션 추가 */

  &:hover {
    background-color: ${(props) =>
      props.$isDark ? "#2a2a2a" : "#eaeaea"}; /* 살짝 강조된 배경색 */
    transform: scale(1.05); /* 약간 확대 */
  }

  &:active {
    transform: scale(0.95); /* 클릭 시 살짝 축소 */
  }

  box-shadow: ${(props) =>
    props.$isDark
      ? "0px 2px 4px rgba(0, 0, 0, 0.5)" /* 다크 모드 섀도우 */
      : "0px 2px 4px rgba(0, 0, 0, 0.1)"}; /* 라이트 모드 섀도우 */
`;

  

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const KAKAO_LOGIN_URI = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;


const Header = () => {
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.common.isLogged);
  const isDarkMode = useSelector((state) => state.common.isDark);

	const changeDarkMode = () => {
			dispatch(setDarkMode(!isDarkMode));
	};

	const handleBellClick = () => {
    alert("알림 버튼 클릭!");
  };

  return (
    <Container $isDark={isDarkMode}>
      <Inner>
        <Left>
        </Left>
        <Center $isDark={isDarkMode}>
					<Link href="/">
            <div className="logo">
              <div className="logo-icon"></div>
              <span className="logo-text">Owl Dev.</span>
            </div>
          </Link>
        </Center>
        <Right $isDark={isDarkMode}>
					<IconButton $isDark={isDarkMode} onClick={changeDarkMode}>
            {isDarkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </IconButton>
					<IconButton $isDark={isDarkMode} onClick={handleBellClick}>
						<HiOutlineBell size={20} />
					</IconButton>
					{!isLogged && 
						<IconButton $isDark={isDarkMode} onClick={() => {window.location.href = KAKAO_LOGIN_URI;}} >
							<RiKakaoTalkFill size={23}/>
						</IconButton>
					}
          {isLogged && <HeaderProfile/>}
        </Right>
      </Inner>
    </Container>
  );
};

export default Header;
