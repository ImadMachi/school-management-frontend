function haveSameKeys(obj1: any, obj2: any) {
  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if lengths of keys arrays are the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Sort the keys arrays
  keys1.sort();
  keys2.sort();

  // Check if all keys are the same
  return keys1.every((key, index) => key === keys2[index]);
}

export default haveSameKeys;
