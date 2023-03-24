
// select all input value when click
export const selectAllInlineText = (e: any) => {
  e.target.focus();
  e.target.select();
};

// onKeyDown
export const saveContentAfterEnter = (e: any) => {
  // console.log(e.target);
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  }
}