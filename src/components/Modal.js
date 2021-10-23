import React from "react";
import styled from "styled-components";
import "styled-components/macro";

import { FiX } from "react-icons/fi";

const ModalConatiner = styled.div.attrs({})`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
  padding: 30px;
  z-index: ${(props) => props.zIndex || 500};
`;

const ModalContent = styled.div`
  min-width: 25%;
  margin: 0 auto;
  width: ${(props) =>
    props.modalContentWidth ? props.modalContentWidth : "410px"};
  min-width: 400px;
`;

export const Modal = ({
  closeModal,
  isActive,
  zIndex,
  modalContentWidth,
  renderBody,
  header = "",
  isHeader = true,
}) => {
  return (
    <>
      {isActive ? (
        <ModalConatiner zIndex={zIndex}>
          <div
            css={`
              min-height: 100%;
              display: flex;
              align-items: center;
            `}
          >
            <ModalContent
              modalContentWidth={modalContentWidth}
              css={`
                background-color: white;
                position: relative;
              `}
            >
              {isHeader && <h3>{header}</h3>}
              <button
                onClick={() => closeModal()}
                css={`
                  right: -30px;
                  position: absolute;
                  top: 0px;
                `}
              >
                <FiX size={24} />
              </button>
              <section>{renderBody()}</section>
            </ModalContent>
          </div>
        </ModalConatiner>
      ) : null}
    </>
  );
};
