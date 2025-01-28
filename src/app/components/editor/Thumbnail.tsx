import styled from "styled-components";
import palette from "../../styles/palette";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useSelector } from "../../store";
import useModal from "@/app/hooks/useModal";
import ConfirmModal from "../modal/ConfirmModal";
import { removeThumbnail, uploadThumbnail } from "@/app/api/thumbnailApi";

interface StyledProps {
	$isDark: boolean;
}

const ThumbnailWrapper = styled.div<StyledProps>`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${(props) => props.$isDark ? palette.darkGray : palette.lightGray}; 
  border: 1px solid ${(props) => (props.$isDark ? palette.gray : palette.darkGray)};
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, background-color 0.3s, border-color 0.3s;

  &:hover {
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ThumbnailPreview = styled.div<{ $maxwidth: string }>`
	width: 90%;
	max-width: ${(props) => props.$maxwidth || '200px'};
	margin-bottom: 10px;
	img {
		width: 100%;
		height: auto;
		border-radius: 8px;
		object-fit: cover;
		border: 1px solid ${palette.gray};
		box-shadow: 0px 2px 5px hsla(0, 0%, 0%, 0.1);
	}
`;

const ThumbnailInputWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const RemoveThumbnailIcon = styled(FaTimes) <StyledProps>`
  color: ${(props) => (props.$isDark ? palette.lightGray : palette.gray)};
  font-size: 20px; 
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${(props) => props.$isDark ? palette.darkRed : palette.darkRed} }
`;

const ThumbnailInput = styled.input`
	display: none !important;
`;

const ThumbnailLabel = styled.label<StyledProps>`
	margin-right: 10px;
	cursor: pointer;
	display: inline-block;
	background-color: ${(props) => props.$isDark ? '#707070' : palette.gray}; 
	color: ${(props) => (props.$isDark ? palette.lightGray : "white")}; 
	padding: 8px 12px;
	border-radius: 4px;
	text-align: center;
	font-size: 14px;

	&:hover {
		background-color: ${(props) => props.$isDark ? palette.gray : palette.darkGray}; 
	}
`;

const FileName = styled.span<StyledProps>`
  font-size: 14px;
	color: ${(props) => (props.$isDark ? palette.lightGray : palette.gray)};
  margin-top: 5px; 
  text-align: center;
`;

interface ThumbnailProps {
	editorMaxWidth: string;
	imageUrl: string;
	setImageUrl?: (imageUrl: string) => void;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ editorMaxWidth, imageUrl, setImageUrl }) => {
	const { openModal, closeModal, ModalPortal } = useModal();
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [thumbnail, setThumbnail] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string>('선택된 파일 없음');
	const modalMessage = '해당 이미지를 삭제하시겠습니까?';

	useEffect(() => {
		if(!imageUrl) return ;
		const fileName = imageUrl.split('/images/') ? imageUrl.split('/images/')[1] :'';
		setThumbnail(imageUrl);
		setFileName(fileName);
	}, [imageUrl]);

	const handleConfirm = async () => {
		try {
			const newLocal = removeThumbnail(fileName);
			console.log(newLocal);
		}
		catch (error) {
			console.log(error);
		}
		setThumbnail(null);
		setFileName('선택된 파일 없음');
	}

	const handleCancel = () => {
		console.log(fileName);
	}

	const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// preview
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === 'string')
					setThumbnail(reader.result);
			};
			reader.readAsDataURL(file);

			try {
				const response = await uploadThumbnail(file);
				setImageUrl?.(response.fileUrl);
				console.log('Upload successful:', response);
				console.log(imageUrl);
			} catch (error) {
				console.error('Upload failed:', error);
				throw error;
			}
		}
	};

	const truncateFileName = (fileName: string, maxLength: number): string => {
		if (fileName == null) return '';
		if (fileName.length <= maxLength) return fileName;

		const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
		const baseName = fileName.substring(0, fileName.lastIndexOf('.'));

		const truncatedBaseName = baseName.slice(0, maxLength - fileExtension.length - 3);
		return `${truncatedBaseName}...${fileExtension}`;
	};



	return (
		<ThumbnailWrapper $isDark={isDarkMode}>
			<ModalPortal>
				<ConfirmModal message={modalMessage} onClose={closeModal} onConfirm={handleConfirm} onCancel={handleCancel} />
			</ModalPortal>
			{thumbnail && (
				<ThumbnailPreview $maxwidth={editorMaxWidth}>
					<Image
						src={thumbnail}
						alt="Thumbnail preview"
						width={400}
						height={200}
						priority
					/>
				</ThumbnailPreview>
			)}
			<ThumbnailInputWrapper>
				<ThumbnailInput
					id="thumbnail-input"
					type="file"
					accept="image/*"
					onChange={handleThumbnailChange}
				/>
				<ThumbnailLabel $isDark={isDarkMode} htmlFor="thumbnail-input">
					{thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
				</ThumbnailLabel>
				{thumbnail && (
					<RemoveThumbnailIcon $isDark={isDarkMode} onClick={openModal} />
				)}
			</ThumbnailInputWrapper>
			<FileName $isDark={isDarkMode}>{truncateFileName(fileName, 30)}</FileName>
		</ThumbnailWrapper>
	);
};