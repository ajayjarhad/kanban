import React, { useState, useEffect } from 'react';
// import CardContainer from './Cards/CardsContainer';
import { IoIosAdd } from "react-icons/io";
import sortBy from "loadash/sortBy";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import positionCalculation from '../../utils/positionCalculation';
import {
    BoardContainer,
    CardHorizontalContainer,
    AddColumnDiv,
    AddColumnForm,
    AddColumnLink,
    AddColumnLinkSpan,
    AddColumnLinkIconSpan,
    AddColumnInput,
    ActiveAddColumnInput,
    SubmitCardButtonDiv,
    SubmitCardButton,
    SubmitCardIcon,
} from "./board.styles";

const Board = () => {
    const [isAddColumnInputActive, setAddColumnInputActive] = useState(false);
    const [addColumnInputText, setAddColumnInputText] = useState("");
    const [boards, setBoard] = useState([]);
    const { loading, error, data } = useQuery(BOARD_QUERY);

    const onAddColumnSubmit = () => {
        if (addColumnInputText) {
            
        }
    };

    const BOARD_QUERY = gql`
  query {
    fetchColumns {
      id
      title
      label
      position
      description
      cards {
        id
        title
        label
        description
        position
      }
    }
  }
`;
const BOARD_SUBSCRIPTION = gql`
  subscription {
    columnAdded {
      id
      title
      label
      description
      position
      cards {
        id
        title
        label
        position
        description
      }
    }
  }
`;
const ADD_COLUMN = gql`
  mutation AddColumn($title: String!, $label: String!, $position: Int!) {
    insertColumn(request: { title: $title, label: $label, position: $position }) {
      title
      description
      id
      label
    }
  }
`;
const UPDATE_COLUMN_POSITION = gql`
mutation UpdateColumn($columnId: String!, $position: Int!) {
  updateColumnPosition(request: { columnId: $columnId, position: $position }) {
    id
    position
  }
}
`;

const ON_COLUMN_POSITION_CHANGES = gql`
subscription {
  onColumnPositionChange {
    id
    position
  }
}
`;
    
    const Board = () => {
        const [isAddColumnInputActive, setAddColumnInputActive] = useState(false);
  
        const [addColumnInpuText, setAddColumnInputText] = useState("");
        const [boards, setBoards] = useState([]);
        const [AddColumn, { insertColumn }] = useMutation(ADD_COLUMN);
  
        const { loading, error, data } = useQuery(BOARD_QUERY);
  
        const [updateColumnPosition] = useMutation(UPDATE_COLUMN_POSITION);
  
        useEffect(() => {
            if (data) {
                setBoards(data.fetchColumns);
            }
        }, [data]);
  
        const { data: { columnAdded } = {} } = useSubscription(BOARD_SUBSCRIPTION);
  
        const { data: { onColumnPositionChange } = {} } = useSubscription(
            ON_COLUMN_POSITION_CHANGES
        );
  
        useEffect(() => {
            if (onColumnPositionChange) {
                console.log("onColumnPositionChange", onColumnPositionChange);
                let newBoards = boards;
  
                newBoards = newBoards.map((board) => {
                    if (board.id === onColumnPositionChange.id) {
                        return { ...board, position: onColumnPositionChange.position };
                    } else {
                        return board;
                    }
                });
                let sortedBoards = sortBy(newBoards, [
                    (board) => {
                        return board.position;
                    },
                ]);
                console.log("useEffect", sortedBoards);
                setBoards(sortedBoards);
            }
        }, [onColumnPositionChange]);
  
        useEffect(() => {
            if (columnAdded) {
                setBoards(boards.concat(columnAdded));
            }
        }, [columnAdded]);
  
        const onColumnDrop = ({ removedIndex, addedIndex, payload }) => {
            if (data) {
                let updatePOSITION = positionCalculation(
                    removedIndex,
                    addedIndex,
                    data.fetchColumns
                );
                let newBoards = boards.map((board) => {
                    if (board.id === payload.id) {
                        return { ...board, position: updatePOSITION };
                    } else {
                        return board;
                    }
                });
  
                let sortedBoards = sortBy(newBoards, [
                    (board) => {
                        return board.position;
                    },
                ]);
  
                updateColumnPosition({
                    variables: {
                        columnId: payload.id,
                        position: parseInt(updatePOSITION),
                    },
                });
                setBoards([...sortedBoards]);
            }
        };
  
        const onAddColumnSubmit = () => {
            if (addColumnInpuText) {
                AddColumn({
                    variables: {
                        title: addColumnInpuText,
                        label: addColumnInpuText,
                        position:
                            boards && boards.length > 0
                                ? boards[boards.length - 1].position + 16384
                                : 16384,
                    },
                });
            }
        };

    }
    
    return (
        <BoardContainer>
       
        <AddColumnDiv onClick={() => setAddColumnInputActive(true)}>
          <AddColumnForm>
            {isAddColumnInputActive ? (
              <React.Fragment>
                <ActiveAddColumnInput
                  onChange={(e) => setAddColumnInputText(e.target.value)}
                />
                <SubmitCardButtonDiv>
                  <SubmitCardButton
                    type="button"
                    value="Add Card"
                    onClick={onAddColumnSubmit}
                  />
                  <SubmitCardIcon>
                    <IoIosAdd />
                  </SubmitCardIcon>
                </SubmitCardButtonDiv>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <AddColumnLink href="#">
                  <AddColumnLinkSpan>
                    <IoIosAdd size={28} />
                    Add another list
                  </AddColumnLinkSpan>
                </AddColumnLink>
                <AddColumnInput />
              </React.Fragment>
            )}
          </AddColumnForm>
        </AddColumnDiv>
      </BoardContainer>
    );
  };
  export default Board;