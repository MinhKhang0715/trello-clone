import React from "react";
import { Container, Draggable, DropResult } from "react-smooth-dnd";
import './Column.scss'
import Card from "../Card/Card";
import { TrelloColumn } from "../../actions/interfaces";

interface ComponentProps {
  column: TrelloColumn;
  onCardDrop(columnId: string, dropResult: DropResult): void;
}

function Column(props: ComponentProps) {
  const { column, onCardDrop } = props;
  const cards = column.cards.sort(function (a, b) {
    return column.cardOrder.indexOf(a.id) - column.cardOrder.indexOf(b.id);
  });

  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          groupName="trello-columns"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
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
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" /> Add another card
        </div>
      </footer>
    </div>
  );
}

export default Column;