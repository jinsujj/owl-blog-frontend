import { useSelector } from "@/app/store";
import palette from "@/app/styles/palette";
import styled, { css } from "styled-components";
import Link from "next/link";
import HeaderProfile from "./HeaderProfile";

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
	max-width: 940px;
	margin: 0 auto;
	padding: 10px 20px;
	box-sizing: border-box;

	@media only screen and (max-width: 768px) {
		flex-wrap: wrap;
	}
`;

const Left = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;

	.toggle-btn {
		background: url("../img/toggle_blue.svg") no-repeat center/contain;
		width: 27px;
		height: 18px;
		cursor: pointer;
	}
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
	display: flex;
	align-items: center;
	gap: 15px; /* 버튼 간 간격 */

	.home-button {
		display: flex;
		align-items: center;
		background-color: ${(props) => (props.$isDark ? "#444" : "#f5f5f5")};
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

const LoginProvider = styled.div`
  margin-top: 5px;
	display: flex;
	justify-content: center;

	.kakao-login {
    border: none;
    background: url("../img/kakao_login_medium.png");
    background-repeat: no-repeat;
    cursor: pointer;
    display: center;
    justify-content: center;
    width: 100px;
    height: 45px;

		&:hover {
      transform: scale(0.95); /* 크기 증가 */
      opacity: 0.8; /* 약간 투명하게 */
    }

    &:active {
      transform: scale(0.90); /* 클릭 시 크기 축소 */
    }
  }
`;
  

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const KAKAO_LOGIN_URI = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;


const Header = () => {
	const isLogged = useSelector((state) => state.common.isLogged);
  const isDarkMode = useSelector((state) => state.common.isDark);

  return (
    <Container $isDark={isDarkMode}>
      <Inner>
        <Left>
          <div className="toggle-btn" />
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
					{!isLogged && 
						<LoginProvider>
							<a href={KAKAO_LOGIN_URI} className="kakao-login" type="button" />
						</LoginProvider>
					}
          {isLogged && <HeaderProfile/>}
        </Right>
      </Inner>
    </Container>
  );
};

export default Header;
