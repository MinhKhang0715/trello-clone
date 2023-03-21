import React from "react";
import './Column.scss'

import Card from "../Card/Card";
import { TrelloColumn } from "../../actions/interfaces";

function Column(props: TrelloColumn) {
  const column = props;
  const cards = column.cards.sort(function (a, b) {
    return column.cardOrder.indexOf(a.id) - column.cardOrder.indexOf(b.id);
  });

  return (
    <div className="column">
      <header>{column.title}</header>
      <ul className="card-list">
        {cards.map((card, index) => <Card key={index} {...card} />)}
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;