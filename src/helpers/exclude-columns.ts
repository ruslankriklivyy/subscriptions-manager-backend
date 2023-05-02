function excludeColumns<T, Key extends keyof T>(entity: T, keys: Key[]) {
  for (const key of keys) {
    delete entity[key];
  }
  return entity;
}

export default excludeColumns;
