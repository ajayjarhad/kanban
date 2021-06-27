// Board.js is responsible for rendering Board component that has 3 columns, to-do, in progress, done.
import React, { useState, useEffect } from "react";
import CardContainer from "../CardsContainer";
import { Container } from "react-smooth-dnd";
import sortBy from "lodash/sortBy";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PosCalculation from "../../utils/pos_calculation";

//CSS is declared in /board.styles.js
import { BoardContainer } from "./board.styles";

// This Query returns all the columns/sections that are in our MongoDB.
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

// This mutate query is used for updating the position of column position change (The app supports drag-n-drop of columns).
const UPDATE_SECTION_POS = gql`
  mutation UpdateSection($sectionId: String!, $pos: Int!) {
    updateSectionPos(request: { sectionId: $sectionId, pos: $pos }) {
      id
      pos
    }
  }
`;
// Subscription query to view position changes on board component.
const ON_SECTION_POS_CHANGES = gql`
  subscription {
    onSectionPosChange {
      id
      pos
    }
  }
`;
// Initialization of board function.
const Board = () => {
  const [boards, setBoards] = useState([]);
  const { loading, error, data } = useQuery(BOARD_QUERY);
  const [updateSectionPos] = useMutation(UPDATE_SECTION_POS);

  // Returns the columns if there are any.
  useEffect(() => {
    if (data) {
      setBoards(data.fetchSections);
    }
  }, [data]);

  // Fires up 'ON_SECTION_POS_CHANGES' query to update the position of the column after it has been dragged around.
  const { data: { onSectionPosChange } = {} } = useSubscription(
    ON_SECTION_POS_CHANGES
  );

  // React hook to call 'onSectionPosChange'[Refer line 43] subscription when the position of column changes
  useEffect(() => {
    if (onSectionPosChange) {
      // console.log("onSectionPosChange", onSectionPosChange);
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
      // console.log("useEffect", sortedBoards);
      setBoards(sortedBoards);
    }
  }, [onSectionPosChange]);

  // This function defines the logic of column drag-n-drop using React Smooth DND
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
      {/* This code uses the function declared above [refer line 93] to be called when column is dragged */}
      <Container
        orientation={"horizontal"}
        onDrop={onColumnDrop}
        onDragStart={() => {}}
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
