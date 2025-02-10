import { useSelector } from "@/app/store";
import styled from "styled-components";
import * as Popover from "@radix-ui/react-popover";
import { logout } from "@/app/api/loginApi";
import { authAction } from "@/app/store/auth";
import { useDispatch } from "react-redux";
import { commonAction } from "@/app/store/common";
import { useRouter } from "next/navigation";
import { FiEdit, FiLogOut } from "react-icons/fi"; // 아이콘 추가

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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
`;

const UserName = styled.h2`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const PopupContent = styled(Popover.Content)`
  background-color: #2c2c2c;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PopupButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #444;
  color: white;
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
    background-color: #555;
    transform: scale(1.05);
  }

  &:active {
    background-color: #333;
    transform: scale(0.98);
  }
`;

const UserProfile = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const postState = useSelector((state) => state.common.postState);
    const userName = useSelector((state) => state.auth.userName);
    const imageUrl = useSelector((state) => state.auth.imageUrl);

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
                        <UserName>{userName || "Guest"}</UserName>
                    </UserInfo>
                </ProfileContainer>
            </Popover.Trigger>

            <Popover.Portal>
                <PopupContent align="start">
                    <PopupButton onClick={onClickPostBlog}>
                        <FiEdit /> 작성하기
                    </PopupButton>
                    <PopupButton onClick={handleLogout}>
                        <FiLogOut /> 로그아웃
                    </PopupButton>
                </PopupContent>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default UserProfile;
