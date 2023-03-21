import React, { useEffect, useState } from "react";
import './BoardContent.scss';
import Column from "../Column/Column";
import { initialData } from "../../actions/initialData";
import { TrelloColumn } from "../../actions/interfaces";

const isObjectEmty = (object: any) => {
  return (
    object &&
    Object.keys(object).length === 0 &&
    object.constructor === Object
  );
};

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState<TrelloColumn[]>([]);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
    if (boardFromDB) {
      setBoard(boardFromDB);

      boardFromDB.columns.sort(function (a, b) {
        return boardFromDB.columnOrder.indexOf(a.id) - boardFromDB.columnOrder.indexOf(b.id);
      });

      setColumns(boardFromDB.columns);
    }
  }, [])

  if (isObjectEmty(board)) {
    return <div className="not-found">Board not found</div>
  }

  return (
    <div className="board-content">
      {columns.map((column, index) => <Column key={index} {...column} />)}
    </div>
  );
}

export default BoardContent;

