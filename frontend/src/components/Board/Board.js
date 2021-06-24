import React, { useState, useEffect } from "react";
import CardContainer from "../CardsContainer";
import { Container } from "react-smooth-dnd";
import sortBy from "lodash/sortBy";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PosCalculation from "../../utils/pos_calculation";

import {
  BoardContainer
} from "./board.styles";

const BOARD_QUERY = gql`
  query {
    fetchSections {
      id
      title
      label
      pos
      description
      cards {
        id
        title
        label
        description
        pos
      }
    }
  }
`;

const UPDATE_SECTION_POS = gql`
  mutation UpdateSection($sectionId: String!, $pos: Int!) {
    updateSectionPos(request: { sectionId: $sectionId, pos: $pos }) {
      id
      pos
    }
  }
`;

const ON_SECTION_POS_CHANGES = gql`
  subscription {
    onSectionPosChange {
      id
      pos
    }
  }
`;



const Board = () => {
  const [boards, setBoards] = useState([]);
  const { loading, error, data } = useQuery(BOARD_QUERY);
  const [updateSectionPos] = useMutation(UPDATE_SECTION_POS);

  useEffect(() => {
    if (data) {
      setBoards(data.fetchSections);
    }
  }, [data]);

  const { data: { onSectionPosChange } = {} } = useSubscription(
    ON_SECTION_POS_CHANGES
  );

  useEffect(() => {
    if (onSectionPosChange) {
      console.log("onSectionPosChange", onSectionPosChange);
      let newBoards = boards;

      newBoards = newBoards.map((board) => {
        if (board.id === onSectionPosChange.id) {
          return { ...board, pos: onSectionPosChange.pos };
        } else {
          return board;
        }
      });
      let sortedBoards = sortBy(newBoards, [
        (board) => {
          return board.pos;
        },
      ]);
      console.log("useEffect", sortedBoards);
      setBoards(sortedBoards);
    }
  }, [onSectionPosChange]);


  const onColumnDrop = ({ removedIndex, addedIndex, payload }) => {
    if (data) {
      let updatePOS = PosCalculation(
        removedIndex,
        addedIndex,
        data.fetchSections
      );
      let newBoards = boards.map((board) => {
        if (board.id === payload.id) {
          return { ...board, pos: updatePOS };
        } else {
          return board;
        }
      });

      let sortedBoards = sortBy(newBoards, [
        (board) => {
          return board.pos;
        },
      ]);

      updateSectionPos({
        variables: {
          sectionId: payload.id,
          pos: parseInt(updatePOS),
        },
      });
      setBoards([...sortedBoards]);
    }
  };

  return (
    <BoardContainer>
      <Container
        orientation={"horizontal"}
        onDrop={onColumnDrop}
        onDragStart={() => {
          console.log("on drag start");
        }}
        getChildPayload={(index) => {
          return boards[index];
        }}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "cards-drop-preview",
        }}
      >
        {boards.length > 0 &&
          boards.map((item, index) => (
           <CardContainer item={item} key={index} boards={boards} />
          ))}
      </Container>
    </BoardContainer>
  );
};

export default Board;
