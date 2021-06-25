// Single card component
import React from "react";
import styled from "styled-components";
import { Container, Draggable } from "react-smooth-dnd";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import "reactjs-popup/dist/index.css";

const CardContainer = styled.div`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  padding: 10px;
  cursor: pointer;
  max-width: 35rem;
  width: 27.5rem;
  margin-bottom: 7px;
  min-width: 230px;
`;

const CardContent = styled.div``;

const Card = ({ card }) => {
  //Material UI's DialogBox handling logic
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Draggable key={card.id}>
      <CardContainer className="card">
        <CardContent onClick={handleClickOpen}>{card.title}</CardContent>
      </CardContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{card.title}</DialogTitle>
        <DialogContent>
          <DialogContentText color="black">Card Description</DialogContentText>
          {card.description
            ? card.description
            : `You haven't entered card description`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="amber">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Draggable>
  );
};

export default Card;
