import React, { useEffect, useRef, useState } from "react";
import './Column.scss'
import { Container, Draggable, DropResult } from "react-smooth-dnd";
import { Dropdown, Form, Button } from "react-bootstrap";

import Card from "../Card/Card";
import ConfirmModal from "../commons/ConfirmModal";
import { TrelloColumn, FormControlElement, TrelloCard } from "../commons/Interfaces";
import { /*MODAL_ACTION_CLOSE,*/ MODAL_ACTION_CONFIRM } from "../../helpers/constants";
import { saveContentAfterEnter, selectAllInlineText } from "../../helpers/contentEditable";

interface ComponentProps {
  column: TrelloColumn;
  onCardDrop(columnId: string, dropResult: DropResult): void;
  onUpdateColumn(newColumnToUpdate: TrelloColumn): void;
}

export default function Column(props: ComponentProps) {
  const { column, onCardDrop, onUpdateColumn  } = props;
  const cards = column.cards.sort(function (a, b) {
    return column.cardOrder.indexOf(a._id) - column.cardOrder.indexOf(b._id);
  });
  const [showModal, setShowModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const [newCardArea, setNewCardArea] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const newCardTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const toggleOpenNewCardArea = () => setNewCardArea(!newCardArea);

  const handleColumnTitleChanged = (e: React.ChangeEvent<FormControlElement>) => setColumnTitle(e.target.value);

  const onNewCardTitleChanged = (e: React.ChangeEvent<FormControlElement>) => setNewCardTitle(e.target.value);

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (newCardTextAreaRef && newCardTextAreaRef.current) {
      newCardTextAreaRef.current.focus();
    }
  }, [newCardArea]);

  const toggleShowModal = () => setShowModal(!showModal);

  const onConfirmModal = (type: any) => {
    if (type === MODAL_ACTION_CONFIRM) {
      // remove column
      const newColumn = {
        ...column,
        _destroyed: true
      };
      onUpdateColumn(newColumn);
    }
    toggleShowModal();
  }

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    };
    onUpdateColumn(newColumn);
  }

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextAreaRef.current?.focus();
      return;
    }

    const newCardToAdd: TrelloCard = {
      _id: Math.random().toString(36).substring(2, 5),
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
      cover: null
    };
    // don't use spread operator because it will modify the original
    let newColumn = JSON.parse(JSON.stringify(column));
    newColumn.cards.push(newCardToAdd);
    newColumn.cardOrder.push(newCardToAdd._id);
    onUpdateColumn(newColumn);
    setNewCardTitle('');
    toggleOpenNewCardArea();
  }

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChanged}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterEnter}
            onClick={selectAllInlineText}
            onMouseDown={e => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />
            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowModal}>Remove list</Dropdown.Item>
              <Dropdown.Item>Move all cards in this list(beta) ...</Dropdown.Item>
              <Dropdown.Item>Archive all cards in this list(beta) ...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="trello-columns"
          onDrop={dropResult => onCardDrop(column._id, dropResult)}
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
        {newCardArea &&
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows={3}
              placeholder="Enter card title..."
              className="textarea-new-card"
              ref={newCardTextAreaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChanged}
              onKeyDown={event => (event.key === 'Enter') && addNewCard()}
            />
          </div>
        }
      </div>
      <footer>
        {newCardArea &&
          <div>
            <Button variant="success" size="sm" onClick={addNewCard}>Add card</Button>
            <span className="cancel-icon" onClick={toggleOpenNewCardArea}>
              <i className="fa fa-trash icon"></i>
            </span>
          </div>
        }
        {!newCardArea &&
          <div className="footer-actions" onClick={toggleOpenNewCardArea}>
            <i className="fa fa-plus icon" /> Add another card
          </div>
        }
      </footer>

      <ConfirmModal
        show={showModal}
        onAction={onConfirmModal}
        title="Remove list"
        content={`Are you sure you want to remove <strong>${column.title}</strong>? <br/>All related cards will also be removed!`}
      />
    </div>
  );
}
