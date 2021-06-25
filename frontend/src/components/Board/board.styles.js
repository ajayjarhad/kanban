import styled from "styled-components";

export const BoardContainer = styled.div`
  background: linear-gradient(-45deg, #000000, #434343);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: #393939;
  overflow-y: hidden;
  overflow-x: auto;
  position: absolute;
  padding: 5px;
  margin: 0;
  align-items: flex-start;
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
