import { useState } from "react";
import styled from "styled-components";

interface WidthSliderProps {
	defaultWidth: number;
	onWidthChange: (width: number) => void;
}

const SliderContainer = styled.div`
  width: 300px;
  margin: 20px auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Slider = styled.input`
  flex: 1;
`;

const Value = styled.span`
  margin-left: 10px;
  white-space: nowrap;
`;

const WidthSlider: React.FC<WidthSliderProps> = ({defaultWidth, onWidthChange}) => {
	const [sliderValue, setSliderValue] = useState<number>(defaultWidth);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newWidth = parseInt(e.target.value, 10);
		setSliderValue(newWidth);
		onWidthChange(newWidth);
	};

	return (
		<SliderContainer>
      <Label>Editor Width:</Label>
      <SliderWrapper>
        <Slider
          type="range"
          min="600"
          max="1200"
          value={sliderValue}
          onChange={handleChange}
        />
        <Value>{sliderValue}px</Value>
      </SliderWrapper>
    </SliderContainer>
	)
}

export default WidthSlider;