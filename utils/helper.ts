export const convertDateTime = (date: Date): String => {
  const dateConvert =
    date.getFullYear() +
    "-" +
    date.getMonth() +
    1 +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  return dateConvert;
}
