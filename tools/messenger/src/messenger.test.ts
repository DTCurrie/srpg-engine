import { expect, test, vi, describe } from "vitest";
import { messenger } from "./messenger";

describe("messenger", () => {
  test(".addObserver()", () => {
    const { addObserver, removeObserver, emit } = messenger();

    const target = {
      toSpy: () => ({}),
    };

    const spy = vi.spyOn(target, "toSpy");
    const handler = () => target.toSpy();

    addObserver("test", handler);
    emit("test");

    expect(spy).toHaveBeenCalled();

    removeObserver("test", handler);
  });

  test(".removeObserver()", () => {
    const { addObserver, removeObserver, emit } = messenger();

    const target = {
      toSpy: () => ({}),
    };

    const spy = vi.spyOn(target, "toSpy");
    const handler = () => target.toSpy();

    addObserver("test", handler);
    emit("test");

    expect(spy).toHaveBeenCalledTimes(1);

    removeObserver("test", handler);
    emit("test");

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test(".clean()", () => {
    const sender = { name: "test-sender" };
    const { _senderTables, addObserver, removeObserver, clean } = messenger();

    const handler = () => ({});

    addObserver("test-a", handler, sender);
    addObserver("test-b", handler, sender);

    expect(_senderTables.get("test-a")?.get(sender)?.length).toEqual(1);
    expect(_senderTables.get("test-b")?.get(sender)?.length).toEqual(1);

    removeObserver("test-a", handler, sender);

    expect(_senderTables.get("test-a")?.get(sender)?.length).toEqual(0);
    expect(_senderTables.get("test-b")?.get(sender)?.length).toEqual(1);

    clean();

    expect(_senderTables.get("test-a")?.get(sender)).toBeUndefined();
    expect(_senderTables.get("test-b")?.get(sender)?.length).toEqual(1);
  });

  test("performance", () => {
    const { addObserver, removeObserver, emit, clean } = messenger();
    const testMessage = "test";
    const clearMessage = "clear";
    const start = "start";
    const finish = "finish";

    const testListener = () => {
      const sender = { id: (Math.random() + 1).toString(36).substring(7) };

      const onTest = () => emit(clearMessage, sender, { isTest: true });
      const onClear = () => removeObserver(testMessage, onTest);

      const addObservers = () => {
        addObserver(testMessage, onTest, sender);
        addObserver(clearMessage, onClear, sender);
      };

      const removeObservers = () => {
        removeObserver(testMessage, onTest, sender);
        removeObserver(clearMessage, onClear, sender);
      };

      return {
        sender,
        addObservers,
        removeObservers,
      };
    };

    performance.mark(start);

    const listeners = [];
    for (let i = 0; i < 10000; i++) {
      const listener = testListener();
      listener.addObservers();
      listeners.push(listener);
      emit(testMessage, listener.sender, {
        some: "thing",
        count: 1234,
        map: { first: "first", second: "second" },
        time: new Date(),
      });
    }

    for (const listener of listeners) {
      listener.removeObservers();
    }

    clean();

    performance.mark(finish);

    const measure = performance.measure(
      "measure start to finish",
      start,
      finish
    );

    expect(measure.duration).toBeLessThan(100);

    performance.clearMarks();
    performance.clearMeasures();
  });
});
