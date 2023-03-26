import React, { useEffect, useRef, useState } from "react";
import { Container, Draggable, DropResult } from "react-smooth-dnd";
import {
  Container as BootstrapContainer,
  Row, Col, Form, Button
} from "react-bootstrap";

import './BoardContent.scss';
import Column from "../Column/Column";
import { initialData } from "../../actions/initialData";
import { Board, TrelloColumn, FormControlElement } from "../commons/Interfaces";
import { applyDrag } from "../../helpers/dragDrop";

const isObjectEmty = (object: any) => {
  return (
    object &&
    Object.keys(object).length === 0 &&
    object.constructor === Object
  );
};

export default function BoardContent() {
  const [board, setBoard] = useState<Board>({
    id: "",
    columnOrder: [],
    columns: []
  });
  const [columns, setColumns] = useState<TrelloColumn[]>([]);
  const [newColumnForm, setNewColumnForm] = useState(false);
  const newColumnInputRef = useRef<HTMLInputElement>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const onNewColumnTitleChanged = (element: React.ChangeEvent<FormControlElement>) => { setNewColumnTitle(element.target.value)/*; console.log(element);*/ };

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

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [newColumnForm])

  if (isObjectEmty(board)) {
    return <div className="not-found">Board not found</div>
  }

  const updateBoard = (newColumns: TrelloColumn[]) => {
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map(col => col.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  }

  const onColumnDrop = (drogResult: DropResult) => {
    let newColumns = applyDrag([...columns], drogResult);
    updateBoard(newColumns);
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

  const toggleOpenNewColumnForm = () => setNewColumnForm(!newColumnForm);

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current?.focus();
      return;
    }

    const newColumnToAdd: TrelloColumn = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }
    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);
    updateBoard(newColumns);
    setNewColumnTitle('');
    toggleOpenNewColumnForm();
  }

  const onUpdateColumn = (newColumnToUpdate: TrelloColumn) => {
    let newColumns = [...columns];
    const indexOfColumnToUpdate = newColumns.findIndex(col => col.id === newColumnToUpdate.id);
    newColumnToUpdate._destroyed ?
      newColumns.splice(indexOfColumnToUpdate, 1) :
      newColumns.splice(indexOfColumnToUpdate, 1, newColumnToUpdate);

    updateBoard(newColumns);
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
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>

      <BootstrapContainer className="trello-container">
        {newColumnForm ?
          <Row>
            <Col className="input-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                className="input-form-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChanged}
                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>Add list</Button>
              <span className="cancel-icon" onClick={toggleOpenNewColumnForm}>
                <i className="fa fa-trash icon"></i>
              </span>
            </Col>
          </Row>
          :
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon" /> Add another list
            </Col>
          </Row>
        }
      </BootstrapContainer>
    </div>
  );
}
