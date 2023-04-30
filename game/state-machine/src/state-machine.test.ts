import { expect, test, describe, vi } from "vitest";
import { createStateMachine } from "./state-machine";

describe("state-machine", () => {
  type TestContext = {
    count: number;
    finished: boolean;
  };

  test(".transition()", () => {
    vi.useFakeTimers();

    const stateMachine = createStateMachine<TestContext>({
      count: 0,
      finished: false,
    });

    const funcs = {
      first: () => ({}),
      second: () => ({}),
      third: () => ({}),
    };

    const spies = {
      first: vi.spyOn(funcs, "first"),
      second: vi.spyOn(funcs, "second"),
      third: vi.spyOn(funcs, "third"),
    };

    stateMachine.transition({
      onEnter: (context) => {
        funcs.first();
        return {
          ...context,
          count: context.count + 1,
        };
      },
    });

    stateMachine.transition({
      onExit: (context) => {
        funcs.second();
        return {
          ...context,
          count: context.count + 1,
        };
      },
    });

    stateMachine.transition({
      onEnter: (context) => {
        funcs.third();
        return {
          ...context,
          finished: true,
        };
      },
    });

    vi.runAllTimers();

    expect(spies.first).toHaveBeenCalled();
    expect(spies.second).toHaveBeenCalled();
    expect(spies.third).toHaveBeenCalled();
  });
});
