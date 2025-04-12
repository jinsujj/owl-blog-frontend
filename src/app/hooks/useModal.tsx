import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  .modal-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
		opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

	.modal-content {
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 12;
    transform: scale(0.9);
    animation: scaleUp 0.3s forwards;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

	@keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
	@keyframes scaleUp {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }

	@keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

	@keyframes scaleDown {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.9);
    }
  }
`;

const useModal = () =>{
    const [modalOpened, setModalOpened] = useState(false);
		const [isClosing, setIsClosing] = useState(false);

    const openModal = () => {
        setModalOpened(true);
				setIsClosing(false);
    }
    
    const closeModal = () => {
				setIsClosing(true);
        setModalOpened(false);
				setTimeout(() => {
					setModalOpened(false);
					}, 300); 
    }

    interface IProps {
        children: React.ReactNode;
    }

    const ModalPortal: React.FC<IProps> = ({ children}) => {
        const ref = useRef<Element | null>(null);
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
            if(document){
                const dom = document.querySelector("#root-modal");
                ref.current = dom;
            }
        },[]);
        
        if(ref.current && mounted && modalOpened) {
            return createPortal(
                <Container>
                  <div
                    className="modal-background"
                    role="presentation"
                    onClick={closeModal}
										style={{ animation: isClosing ? "fadeOut 0.3s forwards" : "" }}
                  />
									  <div
											className="modal-content"
											style={{ animation: isClosing ? "scaleDown 0.3s forwards" : "" }}
										></div>
                  {children}
                </Container>,
                ref.current
              );
        }
        return null;
    };

    return {
        openModal,
        closeModal,
        ModalPortal
    };
};

export default useModal;