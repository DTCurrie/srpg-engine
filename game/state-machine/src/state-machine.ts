export type StateMachine<Context> = {
  transition: (next: State<Context>) => void;
};

export type State<Context = unknown> = {
  onEnter?: (context: Context, previous?: State<Context>) => Partial<Context>;
  onExit?: (context: Context, next: State<Context>) => Partial<Context>;
};

export const createStateMachine = <Context>(
  initialContext?: Context
): StateMachine<Context> => {
  let context: Context = {
    ...initialContext,
  } as Context;

  let state: { previous?: State<Context>; current?: State<Context> } = {};

  const transition = (next: State<Context>) => {
    context = { ...context, ...state.current?.onExit?.(context, next) };
    state = { previous: state.current, current: next };
    setTimeout(
      () =>
        (context = {
          ...context,
          ...next.onEnter?.(context, state.previous),
        }),
      0
    );
  };

  return {
    transition,
  };
};
