interface Base {
  _id: string,
  title: string,
  createdAt?: Date,
  updatedAt?: Date | null,
  _destroy?: boolean
}

export interface TrelloCard extends Base {
  boardId: string,
  columnId: string,
  cover: string | null
}

export interface TrelloColumn extends Base {
  boardId: string,
  cardOrder: string[]
  cards: TrelloCard[]
}

export interface Board extends Base {
  columnOrder: string[],
  columns: TrelloColumn[],
  cards?: TrelloCard[]
}

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
