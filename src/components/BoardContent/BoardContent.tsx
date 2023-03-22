import React, { useEffect, useState } from "react";
import { Container, Draggable, DropResult } from "react-smooth-dnd";

import './BoardContent.scss';
import Column from "../Column/Column";
import { initialData } from "../../actions/initialData";
import { Board, TrelloColumn } from "../../actions/interfaces";
import { applyDrag } from "../../helpers/dragDrop";

const isObjectEmty = (object: any) => {
  return (
    object &&
    Object.keys(object).length === 0 &&
    object.constructor === Object
  );
};

function BoardContent() {
  const [board, setBoard] = useState<Board>({
    id: "",
    columnOrder: [],
    columns: []
  });
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

  const onColumnDrop = (drogResult: DropResult) => {
    let newColumns = applyDrag([...columns], drogResult);
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map(col => col.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  }

  const onCardDrop = (columnId: string, dropResult: DropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      // exclamation point to explicitly say the result of Array.find()
      // in this case never return undefined
      let currentColumn = newColumns.find(col => col.id === columnId)!;
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map(card => card.id);
      setColumns(newColumns);
    }
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        dragHandleSelector=".column-drag-handle"
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}>
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon" /> Add another list
      </div>
    </div>
  );
}

export default BoardContent;

