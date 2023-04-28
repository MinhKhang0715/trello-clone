import axios from "axios"
import { BASE_API_URL } from "../../helpers/constants";
import { Board } from "../../components/commons/Interfaces";

export const fetchBoard = async (id: string) => {
  const request = await axios.get(`${BASE_API_URL}/v1/boards/${id}`);
  return request.data as Board;
}