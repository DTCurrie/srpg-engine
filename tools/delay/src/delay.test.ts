import { expect, test, describe } from "vitest";
import { delay } from "./delay";

describe("delay", () => {
  test("delau()", () => {
    let count = 0;

    const increment = async () => {
      await delay(10);
      count += 1;
    };

    increment();
    expect(count).toEqual(0);
    setTimeout(() => expect(count).toEqual(1), 10);
  });
});
