const quickSort = (arr) => {
  if (arr.length < 2) return arr;

  const pivotIndex = arr.length - 1;
  const pivot = arr[pivotIndex];

  const left = [];
  const right = [];

  let currentItem;
  for (let i = 0; i < pivotIndex; i++) {
    currentItem = arr[i];
    if (currentItem < pivot) {
      left.push(currentItem);
    } else {
      right.push(currentItem);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
};

const quickSort1 = (array) => {
  if (array.length < 2) return array;
  const [pivot, ...another] = array;
  return [
    ...quickSort(another.filter((i) => i < pivot)),
    pivot,
    ...quickSort(another.filter((i) => i > pivot)),
  ];
};
console.log(quickSort1([100, 2, 5, 4, 7, 5, 6, 8, 0, 12, 34, 15]));
