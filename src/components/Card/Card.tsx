import React from "react";
import './Card.scss'
import { TrelloCard } from "../../actions/interfaces";

function Card(props: TrelloCard) {
  const card = props;

  return (
    <li className="card-item">
      {card.cover && <img src={card.cover} className='card-cover' alt=""/>}
      {card.title}
    </li>
  );
}

export default Card;