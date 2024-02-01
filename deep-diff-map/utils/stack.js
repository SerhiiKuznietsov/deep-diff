class Stack {
  #stack;
  #size;

  constructor(initData) {
    this.#stack = [initData];
    this.#size = 0;

    if (initData) {
      this.add(initData);
    }
  }

  add(data) {
    this.#size += 1;
    this.#stack.push(data);
  }

  get() {
    this.#size -= 1;
    return this.#stack.pop();
  }

  get size() {
    return this.#size;
  }
}

module.exports = {
  Stack,
};
