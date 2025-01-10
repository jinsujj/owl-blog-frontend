import { useSelector } from "@/app/store";
import palette from "@/app/styles/palette";
import styled, { css } from "styled-components";
import Link from "next/link";

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

  .inner {
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
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;

    .toggle-btn {
      background: url("../img/toggle_blue.svg") no-repeat center/contain;
      width: 27px;
      height: 18px;
      cursor: pointer;
    }
  }

  .center {
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
  }

  .right {
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

    .logout-button {
      display: flex;
      align-items: center;
      padding: 8px 15px;
      border: 1px solid ${(props) => (props.$isDark ? "#fff" : "#007bff")};
      color: ${(props) => (props.$isDark ? "#fff" : "#007bff")};
      border-radius: 5px;
      cursor: pointer;
      background-color: transparent;

      &:hover {
        background-color: ${(props) => (props.$isDark ? "#333" : "#f0f8ff")};
      }
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 5px;
      color: ${(props) => (props.$isDark ? "#fff" : "#333")};
      font-weight: bold;

      .profile-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: ${(props) => (props.$isDark ? "#666" : "#ccc")};
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
      }
    }
  }
`;

const Header = () => {
  const isDarkMode = useSelector((state) => state.common.isDark);

  return (
    <Container $isDark={isDarkMode}>
      <div className="inner">
        {/* 왼쪽 영역 */}
        <div className="left">
          <div className="toggle-btn" />
        </div>

        {/* 가운데 영역 */}
        <div className="center">
					<Link href="/">
            <div className="logo">
              <div className="logo-icon"></div>
              <span className="logo-text">부엉이 개발자</span>
            </div>
          </Link>
        </div>

        {/* 오른쪽 영역 */}
        <div className="right">
          <button className="home-button">
            <a>수정하기</a>
          </button>
          <button className="logout-button">Logout</button>
          <div className="profile">
            <div className="profile-icon">진</div>
            진수
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Header;
