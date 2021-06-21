
import React, { useEffect, useState } from "react";
import Card from "../Card";
import { Container, Draggable } from "react-smooth-dnd";
import { IoIosAdd } from "react-icons/io";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import positionCalculation from "../../../../utils/poitionCalculation";
import sortBy from "lodash/sortBy";

import {
  Wrapper,
  WrappedColumn,
  CardContainerHeader,
  ContainerContainerTitle,
  CardsContainer,
  AddCardButtonDiv,
  AddCardButtonSpan,
  CardComposerDiv,
  ListCardComponent,
  ListCardDetails,
  ListCardTextArea,
  SubmitCardButtonDiv,
  SubmitCardButton,
  SubmitCardIcon,
} from "./index-styles";

const ADD_CARD = gql`
  mutation InsertCard(
    $columnId: ID!
    $title: String!
    $label: String!
    $position: Int!
  ) {
    insertCard(
      request: {
        columnId: $columnId
        title: $title
        label: $label
        position: $position
      }
    ) {
      title
      label
      id
    }
  }
`;

const onCardAdded = gql`
  subscription {
    cardAdded {
      id
      title
      description
      columnId
      position
    }
  }
`;

const UPDATE_CARD = gql`
  mutation UpdateCard($cardId: String!, $position: Int!, $columnId: String!) {
    updateCardPosition(
      request: { cardId: $cardId, position: $position, columnId: $columnId }
    ) {
      id
      title
      label
      position
    }
  }
`;

const ON_CARD_UPDATE_SUBSCRIPTION = gql`
  subscription {
    onCardPositionChange {
      id
      title
      label
      description
      position
      columnId
    }
  }
`;

const CardContainer = ({ item, boards }) => {
  const [cards, setCards] = useState([]);
  const [isTempCardActive, setTempCardActive] = useState(false);
  const [cardText, setCardText] = useState("");

  const [insertCard, { data }] = useMutation(ADD_CARD);

  const [updateCardPosition] = useMutation(UPDATE_CARD);

  const { data: { cardAdded } = {} } = useSubscription(onCardAdded);

  const { data: { onCardPositionChange } = {} } = useSubscription(
    ON_CARD_UPDATE_SUBSCRIPTION
  );

  useEffect(() => {
    if (item && item.cards) {
      setCards(item.cards);
    }
  }, [item]);

  useEffect(() => {
    if (cardAdded) {
      if (item.id === cardAdded.columnId) {
        setCards(item.cards.concat(cardAdded));

        setTempCardActive(false);
      }
    }
  }, [cardAdded]);

  useEffect(() => {
    if (onCardPositionChange) {
      if (item.id === onCardPositionChange.columnId) {
        //subscription logic comes here
      }
    }
  }, [onCardPositionChange]);

  const onCardDrop = (columnId, addedIndex, removedIndex, payload) => {
    let updatedPOSITION;
    if (addedIndex !== null && removedIndex !== null) {
      let boardCards = boards.filter((p) => p.id === columnId)[0];

      updatedPOSITION = positionCalculation(removedIndex, addedIndex, boardCards.cards);

      let newCards = cards.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            position: updatedPOSITION,
          };
        } else {
          return item;
        }
      });
      newCards = sortBy(newCards, (item) => item.position);

      console.log("newCards", newCards);
      setCards(newCards);

      updateCardPosition({
        variables: {
          cardId: payload.id,
          position: parseInt(updatedPOSITION),
          columnId: columnId,
        },
      });
    } else if (addedIndex !== null) {
      const newColumn = boards.filter((p) => p.id === columnId)[0];
      const columnIndex = boards.indexOf(newColumn);

      if (addedIndex === 0) {
        updatedPOSITION = newColumn.cards[0].position / 2;
      } else if (addedIndex === newColumn.cards.length) {
        updatedPOSITION = newColumn.cards[newColumn.cards.length - 1].position + 16384;
      } else {
        let afterCardPOSITION = newColumn.cards[addedIndex].position;
        let beforeCardPOSITION = newColumn.cards[addedIndex - 1].position;

        updatedPOSITION = (afterCardPOSITION + beforeCardPOSITION) / 2;
      }

      let newCards = cards.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            position: updatedPOSITION,
          };
        } else {
          return item;
        }
      });

      newCards = sortBy(newCards, (item) => item.position);

      setCards(newCards);

      updateCardPosition({
        variables: {
          cardId: payload.id,
          position: parseInt(updatedPOSITION),
          columnId: columnId,
        },
      });
    }
  };

  const onAddButtonClick = () => {
    setTempCardActive(true);
  };

  const onAddCardSubmit = (e) => {
    e.preventDefault();
    if (cardText) {
      console.log("==>", cards[cards.length - 1]);
      insertCard({
        variables: {
          columnId: item.id,
          title: cardText,
          label: cardText,
          position:
            cards && cards.length > 0
              ? cards[cards.length - 1].position + 16348
              : 16348,
        },
      });

      setCardText("");
    }
  };

  return (
    <Draggable key={item.id}>
      <Wrapper className={"card-container"}>
        <WrappedColumn>
          <CardContainerHeader className={"column-drag-handle"}>
            <ContainerContainerTitle>{item.title}</ContainerContainerTitle>
          </CardContainerHeader>
          <CardsContainer>
            <Container
              orientation={"vertical"}
              groupName="col"
              // onDragStart={(e) => console.log("Drag Started")}
              // onDragEnd={(e) => console.log("drag end", e)}
              onDrop={(e) => {
                console.log("card", e);
                onCardDrop(item.id, e.addedIndex, e.removedIndex, e.payload);
              }}
              dragClass="card-ghost"
              dropClass="card-ghost-drop"
              onDragEnter={() => {
                // console.log("drag enter:", item.id);
              }}
              getChildPayload={(index) => {
                return cards[index];
              }}
              onDragLeave={() => {
                // console.log("drag leave:", item.id);
              }}
              // onDropReady={(p) => console.log("Drop ready: ", p)}
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drop-preview",
              }}
              dropPlaceholderAnimationDuration={200}
            >
              {cards.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </Container>
            {isTempCardActive ? (
              <CardComposerDiv>
                <ListCardComponent>
                  <ListCardDetails>
                    <ListCardTextArea
                      placeholder="Enter a title for the card"
                      onChange={(e) => {
                        setCardText(e.target.value);
                      }}
                    />
                  </ListCardDetails>
                </ListCardComponent>
                <SubmitCardButtonDiv>
                  <SubmitCardButton
                    type="button"
                    value="Add Card"
                    onClick={onAddCardSubmit}
                  />
                  <SubmitCardIcon>
                    <IoIosAdd />
                  </SubmitCardIcon>
                </SubmitCardButtonDiv>
              </CardComposerDiv>
            ) : (
              <AddCardButtonDiv onClick={onAddButtonClick}>
                <AddCardButtonSpan>Add another card</AddCardButtonSpan>
              </AddCardButtonDiv>
            )}
          </CardsContainer>
        </WrappedColumn>
      </Wrapper>
    </Draggable>
  );
};

export default CardContainer;