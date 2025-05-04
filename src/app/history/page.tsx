'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { checkTokenValidity } from '../api/loginApi';
import Script from 'next/script';
import WidthSlider from "@/app/components/common/WidthSlder";


const Container = styled.div<{width: string}>`
  margin: 0 auto;
  padding: 2rem 1rem;
  max-width: ${(props) => props.width};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }

  margin-bottom: 1.5rem;
`;

const StyledInput = styled.input`
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const SubmitButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const MapContainer = styled.div`
  margin-top: 1.5rem;
`;


const SliderWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 100px;
	z-index: 1000;

	@media (max-width: 768px) {
    display: none;
  }
`;


const NaverMapWithMarkers = dynamic(() => import('./NaverMapWithMarkers'), {
  ssr: false
});

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function MapPage() {
  const [from, setFrom] = useState(getTodayDateString());
  const [to, setTo] = useState(getTodayDateString());
  // state 
  const [editorMaxWidth, setEditorMaxWidth] = useState<string>('1000px');
  const [searchRange, setSearchRange] = useState<{ from: string; to: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // token check 
  useEffect(() => {
    const validate = async () => {
      const isValid = await checkTokenValidity();
      setIsValidToken(isValid);
    };

    validate();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼이 제출됨!', from, to);
    if (from && to) {
      setSearchRange({ from, to });
    }
  };

  const handleWidthChage = (width: number) => {
    setEditorMaxWidth(`${width}px`);
  }

  if (isValidToken === null || !isValidToken) {
    return (
      <p>Not Authorized</p>
    )
  }
  else {
    return (
      <>
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
          strategy="beforeInteractive"
        />
        <Container width={editorMaxWidth}>
          <Title>방문자 IP 기반 위치</Title>
          <Form onSubmit={handleSubmit}>
            <StyledInput
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
            <StyledInput
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
            <SubmitButton type="submit">조회</SubmitButton>
          </Form>
          {searchRange && (
            <MapContainer>
              <NaverMapWithMarkers from={searchRange.from} to={searchRange.to} />
            </MapContainer>
          )}
          <SliderWrapper>
            <WidthSlider defaultWidth={1000} onWidthChange={handleWidthChage} />
          </SliderWrapper>
        </Container>
      </>
    );
  }
}