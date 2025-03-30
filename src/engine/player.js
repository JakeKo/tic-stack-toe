function createPlayer(name, inventory = [2, 2, 2]) {
  return {
    name,
    inventory,
  };
}

export { createPlayer };
