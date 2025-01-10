import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 90vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Container = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
  text-align: center;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 15px 20px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

export const Content = styled.div<{color: string}>`
  padding: 20px;
  font-size: 18px;
  color: ${(props) => props.color};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
`;

export const ActionButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

export const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

interface IProps {
  message: string;
	color: string;
  onClose: () => void;
}

const MessageModal = ({message, color, onClose}: IProps) => {
	return (
    <Overlay>
      <Container>
        <Header>
          <Title>Notification</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Content color={color}>
          <p>{message}</p>
        </Content>
        <Footer>
          <ActionButton onClick={onClose}>OK</ActionButton>
        </Footer>
      </Container>
    </Overlay>
  );
};

export default MessageModal;