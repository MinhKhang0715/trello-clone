import React from "react";
import './Card.scss'
import { TrelloCard } from "../../actions/interfaces";

function Card(props: TrelloCard) {
  const card = props;

  return (
    <div className="card-item">
      {card.cover && <img src={card.cover} className='card-cover' alt="" onMouseDown={e => e.preventDefault()} />}
      {card.title}
    </div>
  );
}

export default Card;