export interface TrelloCard {
    id: string,
    boardId: string,
    columnId: string,
    title: string,
    cover: string | null
};

export interface TrelloColumn {
    id: string,
    boardId: string,
    title: string,
    cardOrder: string[],
    cards: TrelloCard[],
    _destroyed?: boolean
}

export interface Board {
    id: string,
    columnOrder: string[],
    columns: TrelloColumn[]
}

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
