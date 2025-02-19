import { useSelector } from "@/app/store";
import styled from "styled-components";
import * as Popover from "@radix-ui/react-popover";
import { logout } from "@/app/api/loginApi";
import { authAction } from "@/app/store/auth";
import { useDispatch } from "react-redux";
import { commonAction } from "@/app/store/common";
import { useRouter } from "next/navigation";
import { FiEdit, FiLogOut } from "react-icons/fi"; // 아이콘 추가

interface StyledProps {
	$isdark: boolean;
}


const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 6px;
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

	border-radius: 6px; 
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const UserName = styled.h2<StyledProps>`
	color: ${(props) => props.$isdark ? "#f9f9f9" : "#1e1e1e"}; 
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const PopupContent = styled(Popover.Content)<StyledProps>`
  background-color: ${(props) => props.$isdark ? "#2c2c2c" : "#ffffff"};
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${(props) => props.$isdark ? "#444" : "#ddd"};
`;

const PopupButton = styled.button<StyledProps>`
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => props.$isdark ? "#444" : "#f0f0f0"};
  color: ${(props) => props.$isdark ? "#ffffff" : "#1e1e1e"};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; 

  &:hover {
    background-color: ${(props) => props.$isdark ? "#555" : "#e0e0e0"};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${(props) => props.$isdark ? "#333" : "#d0d0d0"};
    transform: scale(0.98);
  }
`;

const UserProfile = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const postState = useSelector((state) => state.common.postState);
	const userName = useSelector((state) => state.auth.userName);
	const imageUrl = useSelector((state) => state.auth.imageUrl);
	const isDarkMode = useSelector((state) => state.common.isDark);


	const onClickPostBlog = () => {
		console.log(postState);
		dispatch(commonAction.setPostState("created"));
		router.push("/editor");
	};

	const handleLogout = () => {
		console.log("logout");
		logout();
		dispatch(authAction.setLogout());
		window.location.replace("/");
	};

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<ProfileContainer>
					<Avatar src={imageUrl || "/img/owl.svg"} alt="User Avatar" />
					<UserInfo>
						<UserName $isdark={isDarkMode}>
							{userName || "Guest"}
						</UserName>
					</UserInfo>
				</ProfileContainer>
			</Popover.Trigger>

			<Popover.Portal>
				<PopupContent $isdark={isDarkMode} align="start">
					<PopupButton $isdark={isDarkMode} onClick={onClickPostBlog}>
						<FiEdit /> 작성하기
					</PopupButton>
					<PopupButton $isdark={isDarkMode} onClick={handleLogout}>
						<FiLogOut /> 로그아웃
					</PopupButton>
				</PopupContent>
			</Popover.Portal>
		</Popover.Root>
	);
};

export default UserProfile;
