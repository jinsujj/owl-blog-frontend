import React from "react";
import styled from "styled-components";

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

interface Props {
	src: string;
	alt: string;
}

const Thumbnail = ({ src, alt }: Props ) => {
  return <ThumbnailImage src={src} alt={alt} />;
};

export default Thumbnail;
