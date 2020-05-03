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

export function formatFileSize(size) {
  let number = Number(size);
  if (number < 1048576) {
    return (number / 1024).toFixed(2) + ' KB';
  } else if (number < 1073741824) {
    return (number / 1024 / 1024).toFixed(2) + ' MB';
  } else {
    return (number / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  }
}
