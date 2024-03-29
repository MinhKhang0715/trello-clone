import React, { useEffect, useRef, useState } from "react";
import { Container, Draggable, DropResult } from "react-smooth-dnd";
import {
  Container as BootstrapContainer,
  Row, Col, Form, Button
} from "react-bootstrap";

import './BoardContent.scss';
import Column from "../Column/Column";
import { Board, TrelloColumn, FormControlElement, TrelloCard } from "../commons/Interfaces";
import { applyDrag } from "../../helpers/dragDrop";
import { apiCalls } from "../../actions/ApiCall";

const isObjectEmty = (object: any) => {
  return (
    object &&
    Object.keys(object).length === 0 &&
    object.constructor === Object
  );
};

const isArrayEqual = (a: any[], b: any[]) => {
  return a.length === b.length && a.every((element, index) => element === b[index]);
}

export default function BoardContent() {
  const [board, setBoard] = useState<Board>({
    _id: "",
    columnOrder: [],
    columns: [],
    title: ''
  });
  const [columns, setColumns] = useState<TrelloColumn[]>([]);
  const [newColumnForm, setNewColumnForm] = useState(false);
  const newColumnInputRef = useRef<HTMLInputElement>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const onNewColumnTitleChanged = (element: React.ChangeEvent<FormControlElement>) => { setNewColumnTitle(element.target.value)/*; console.log(element);*/ };

  useEffect(() => {
    apiCalls.fetchBoard('644b436873072813fe581a33').then(board => {
      setBoard(board);

      board.columns.sort(function (a, b) {
        return board.columnOrder.indexOf(a._id) - board.columnOrder.indexOf(b._id);
      });

      setColumns(board.columns);
    })
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

  const updateBoardContent = (newColumns: TrelloColumn[]) => {
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map(col => col._id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  }

  const onColumnDrop = (drogResult: DropResult) => {
    let newColumns = applyDrag(JSON.parse(JSON.stringify(columns)) as TrelloColumn[], drogResult);
    let newBoard = JSON.parse(JSON.stringify(board)) as Board;

    newBoard.columnOrder = newColumns.map(col => col._id);
    if (isArrayEqual(newBoard.columnOrder, board.columnOrder)) return;
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
    apiCalls.updateBoard(newBoard._id, newBoard).then(updatedBoard => {

    }).catch(error => {
      console.log(error.message);
      setColumns(columns);
      setBoard(board);
    });
  }

  const onCardDrop = (columnId: string, dropResult: DropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      // exclamation point to explicitly say the result of Array.find()
      // in this case never return undefined
      let currentColumn = newColumns.find(col => col._id === columnId)!;
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map(card => card._id);
      setColumns(newColumns);
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        // card moved within a column
        // update cardOrder in the current column
        apiCalls.updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns));
      } else {
        // card moved from column to another column
        // update columnId in the card, then update the cardOrder in both the origin column and the targeted column
        apiCalls.updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns));
        if (dropResult.addedIndex !== null) {
          let currentCard = dropResult.payload as TrelloCard;
          currentCard.columnId = currentColumn._id;
          apiCalls.updateCard(currentCard._id, currentCard);
        }
      }
    }
  }

  const toggleOpenNewColumnForm = () => setNewColumnForm(!newColumnForm);

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current?.focus();
      return;
    }

    const newColumnToAdd: any = {
      boardId: board._id,
      title: newColumnTitle.trim(),
    }
    // call api
    apiCalls.createNewColumn(newColumnToAdd).then(newCol => {
      let newColumns = [...columns];
      newColumns.push(newCol);
      updateBoardContent(newColumns);
      setNewColumnTitle('');
      toggleOpenNewColumnForm();
    })
  }

  const onUpdateColumnState = (newColumnToUpdate: TrelloColumn) => {
    let newColumns = [...columns];
    const indexOfColumnToUpdate = newColumns.findIndex(col => col._id === newColumnToUpdate._id);
    newColumnToUpdate._destroy ?
      newColumns.splice(indexOfColumnToUpdate, 1) :
      newColumns.splice(indexOfColumnToUpdate, 1, newColumnToUpdate);

    updateBoardContent(newColumns);
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
              onUpdateColumnState={onUpdateColumnState}
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
