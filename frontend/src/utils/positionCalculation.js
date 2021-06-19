
export default function (removedIndex, addedIndex, arr) {
    let position;
    if (addedIndex === arr.length - 1) {
      position = arr[arr.length - 1].position + 16384;
    } else if (addedIndex === 0) {
      position = arr[0].position / 2;
    } else if (addedIndex < removedIndex) {
      let beforePOSITION = arr[addedIndex - 1].position;
      let afterPOSITION = arr[addedIndex].position;
  
      position = (beforePOSITION + afterPOSITION) / 2;
    } else if (addedIndex > removedIndex) {
      let beforePOSITION = arr[addedIndex + 1].position;
      let afterPOSITION = arr[addedIndex].position;
  
      position = (beforePOSITION + afterPOSITION) / 2;
    }
  
    return position;
  }