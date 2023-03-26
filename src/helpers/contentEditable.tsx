import React from "react";
import { FormControlElement } from "../components/commons/Interfaces";

// select all input value when click
export const selectAllInlineText = (e: React.MouseEvent<FormControlElement>) => {
  e.currentTarget.focus();
  e.currentTarget.select();
};

// onKeyDown
export const saveContentAfterEnter = (e: React.KeyboardEvent<FormControlElement>) => {
  // console.log(e.target);
  if (e.key === 'Enter') {
    e.preventDefault();
    e.currentTarget.blur();
  }
}