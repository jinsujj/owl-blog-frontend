import { useSelector } from "@/app/store";
import styled from "styled-components";

interface StyledProps {
	$isDark: boolean;
}

const VisitorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const VisitorInfo = styled.div<StyledProps>`
  width: 80%;
  padding: 10px 0px;
  border-radius: 10px;
  background-color: ${(props) => (props.$isDark ? "#555" : "#f1f1f1")};
  color: ${(props) => (props.$isDark ? "#fff": "#333")};
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;


const VisitNumber = styled.div<StyledProps>`
  font-size: 14px;
  color : ${(props) => (props.$isDark ? "#ffcc00" : "#007bff")};
`;


export const VisitorBox = () => {
	const isDarkMode = useSelector((state) => state.common.isDark);

	const totalVisit = 472312;
  const todayVisit = 54;

	return (
		<VisitorWrapper>
			<VisitorInfo $isDark={isDarkMode}>
				Total <VisitNumber $isDark={isDarkMode}>{totalVisit.toLocaleString()}</VisitNumber>
				Today <VisitNumber $isDark={isDarkMode}>{todayVisit.toLocaleString()}</VisitNumber>
			</VisitorInfo>
		</VisitorWrapper>
	)
}

export default VisitorBox;