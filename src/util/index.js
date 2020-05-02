import dayjs from "dayjs";

export function formatResponseDateTime(data) {
  return data.map(item => formatItemResponseDateTime(item));
}

export function formatItemResponseDateTime(item) {
  item.gmtCreate = dayjs(item.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
  item.gmtModified = dayjs(item.gmtModified).format('YYYY-MM-DD HH:mm:ss')
  return item;
}

export function group(array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}
