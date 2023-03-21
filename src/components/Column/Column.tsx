import React from "react";
import { Container, Draggable, DropResult } from "react-smooth-dnd";
import './Column.scss'
import Card from "../Card/Card";
import { TrelloColumn } from "../../actions/interfaces";

function Column(props: TrelloColumn) {
  const column = props;
  const cards = column.cards.sort(function (a, b) {
    return column.cardOrder.indexOf(a.id) - column.cardOrder.indexOf(b.id);
  });

  const onCardDrop = (dropResult: DropResult) => {
    console.log(dropResult);
  }

  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          groupName="trello-columns"
          onDrop={onCardDrop}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card {...card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;