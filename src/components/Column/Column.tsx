import React from "react";
import './Column.scss'

import Task from "../Task/Task";

function Column() {
  return (
    <div className="column">
      <header>Brain storm</header>
      <ul className="task-list">
        <Task />
        <li className="task-item">Add what you like to work on below</li>
        <li className="task-item">Add what you like to work on below</li>
        <li className="task-item">Add what you like to work on below</li>
        <li className="task-item">Add what you like to work on below</li>
        <li className="task-item">Add what you like to work on below</li>
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;