import dayjs from "dayjs";

export function formatResponseDateTime(data) {
  return data.map(item => formatItemResponseDateTime(item));
}

export function formatDateTime(p, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(p).format(format);
}

export function formatItemResponseDateTime(item) {
  item.gmtCreate = formatDateTime(item.gmtCreate);
  item.gmtModified = formatDateTime(item.gmtModified);
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
