import { useSelector } from "@/app/store";
import { useState } from "react";
import styled from "styled-components";

interface StyledProps {
	$isDark: boolean;
}

const ProfileWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
  border-radius: 10px;
  padding: 20px 30px;
  width: 80%; /* 프로필 박스 크기 조정 */
  max-width: 600px; /* 최대 크기 제한 */
  margin: 0 auto; /* 가운데 정렬 */
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  border: 3px solid #4caf50; /* 감각적인 보더 추가 */
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const ProfileStats = styled.div`
	padding-top: 5px;
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

const FollowButton = styled.button`
  margin-top: 10px;
  padding: 7px 20px;
  border: 1px solid #4caf50;
  background-color: #4caf50;
  color: #fff;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: transparent;
    color: #4caf50;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  color: ${(props) => (props.$isActive ? "#4caf50" : "#666")};
  border: none;
  border-bottom: ${(props) =>
    props.$isActive ? "3px solid #4caf50" : "3px solid transparent"};
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #4caf50;
  }
`;

const TabContent = styled.div`
  padding: 20px;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  animation: fade-in 0.4s ease-in-out;

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const UserProfile = () => {
	const isDarkMode = useSelector((state) => state.common.isDark);
  const [activeTab, setActiveTab] = useState("글");

  const renderTabContent = () => {
    switch (activeTab) {
      case "글":
        return <div>사용자가 작성한 글 목록입니다.</div>;
      case "시리즈":
        return <div>사용자가 작성한 시리즈 목록입니다.</div>;
      case "소개":
        return <div>사용자에 대한 소개입니다.</div>;
      default:
        return null;
    }
  };

  return (
    <ProfileWrapper $isDark={isDarkMode}>
      <ProfileImageWrapper>
        <ProfileImage src="https://avatars.githubusercontent.com/u/19955904?v=4" alt="Profile" />
        <ProfileDetails>
          <ProfileName>jinsujj</ProfileName>
          <ProfileStats>
            <span>3 팔로워</span>
            <span>0 팔로잉</span>
          </ProfileStats>
          <FollowButton>팔로우</FollowButton>
        </ProfileDetails>
      </ProfileImageWrapper>
      <TabContainer>
        {["글", "시리즈", "소개"].map((tab) => (
          <TabButton
            key={tab}
            $isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </TabButton>
        ))}
      </TabContainer>
      <TabContent>{renderTabContent()}</TabContent>
    </ProfileWrapper>
  );
};
