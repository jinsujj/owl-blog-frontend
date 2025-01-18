import { useSelector } from "@/app/store";
import palette from "@/app/styles/palette";
import { MdEdit, MdVisibility } from "react-icons/md";
import styled from "styled-components";

const TitleInputWrapper = styled.div`
	display: flex;
	gap:10px;
	width: 100%;
  font-size: 28px; 
  padding-top: 20px;
	padding-bottom: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
	align-items: center;

  &:focus {
    border-color: ${palette.blue};
    box-shadow: 0 0 5px ${palette.blue};
    outline: none; 
  }
`;

const TitleInput = styled.input<{width: string, $isDark:boolean}>`
  background-color: ${(props) => (props.$isDark ? "#333" : "#fff")} !important; 
	width: 100%;
	max-width: ${(props) => props.width};
	font-size: 32px;
	font-weight: bold;
	padding: 10px;
	border: none;
	border-radius: 4px;
	height:100%;;
`;

const IconButton = styled.button<{ $isReadOnly: boolean , $isDark: boolean}>`
	background-color: ${(props) => props.$isDark ? "#1e1e1e" : "#f9f9f9"}; 
  color: ${(props) => (props.$isDark ? "#fff" : "#333")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px; 
  height: 34px; 
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isReadOnly ? palette.darkBlue : palette.darkBlue)};
  }

  &:active {
    transform: scale(0.95); 
  }

  svg {
    font-size: 24px;
  }
`;

interface TitleProps {
	editorMaxWidth: string;
	title: string; 
	setTitle: (title: string) => void;
	isReadOnly: boolean;
	setIsReadOnly:(isReadOnly: boolean) => void;
}

export const Title :React.FC<TitleProps> = ({editorMaxWidth, title, isReadOnly, setTitle, setIsReadOnly}) => {
	const isDarkMode = useSelector((state) => state.common.isDark);

	const toggleMode = () => {
		setIsReadOnly(!isReadOnly);
	}

	return (
		<TitleInputWrapper>
			<TitleInput $isDark={isDarkMode}
						type="text"
						placeholder="Write a Title..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						readOnly={isReadOnly}
						width={editorMaxWidth}
					/>
			<IconButton $isReadOnly={isReadOnly} $isDark={isDarkMode} onClick={toggleMode}>
				{isReadOnly ? <MdVisibility /> : <MdEdit />}
			</IconButton>
		</TitleInputWrapper>
	);
}

export default Title;