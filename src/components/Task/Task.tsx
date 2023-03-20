import React from "react";
import './Task.scss'
import logo from '../../logo.svg'
function Task() {
  return (
    <li className="task-item">
      <img src={logo}
        alt='logo' />
      TITLE: THIS IS A LOGO
    </li>
  );
}

export default Task;