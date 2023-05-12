import axios from "axios"
import { BASE_API_URL } from "../../helpers/constants";
import { Board, TrelloColumn, TrelloCard } from "../../components/commons/Interfaces";

export const fetchBoard = async (id: string) => {
  const request = await axios.get(`${BASE_API_URL}/v1/boards/${id}`);
  return request.data as Board;
}

export const updateBoard = async (id: string, data: Board) => {
  const request = await axios.put(`${BASE_API_URL}/v1/boards/${id}`, data);
  return request.data as Board;
};

export const createNewColumn = async (data: TrelloColumn) => {
  const request = await axios.post(`${BASE_API_URL}/v1/columns/`, data);
  return request.data as TrelloColumn;
}

export const updateColumn = async (id: string, data: TrelloColumn) => {
  const request = await axios.put(`${BASE_API_URL}/v1/columns/${id}`, data);
  return request.data as TrelloColumn;
}

export const createNewCard = async (data: TrelloCard) => {
  const request = await axios.post(`${BASE_API_URL}/v1/cards/`, data);
  return request.data as TrelloCard;
}

export const updateCard = async (id: string, data: TrelloCard) => {
  const request = await axios.put(`${BASE_API_URL}/v1/cards/${id}`, data);
  return request.data as TrelloCard;
}
