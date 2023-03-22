import { DropResult } from "react-smooth-dnd";
import { TrelloColumn, TrelloCard } from '../actions/interfaces'

export const applyDrag = (arr: TrelloColumn[] | TrelloCard[], dragResult: DropResult): any[] => {
  const { removedIndex, addedIndex, payload } = dragResult;
  const result = [...arr];
  let itemToAdd = payload;
  if (removedIndex !== null)
    itemToAdd = result.splice(removedIndex, 1)[0];
  
  if (addedIndex !== null)
    result.splice(addedIndex, 0, itemToAdd);

  return result;
};