export const button = (label: string, handler: (e: Event) => void) => {
  const btn = document.createElement("button");

  btn.textContent = label;
  btn.classList.add(
    ...[
      "w-44",
      "border-2",
      "border-slate-700",
      "bg-selected",
      "opacity-80",
      "hover:border-slate-900",
      "hover:bg-selected-400",
    ]
  );
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handler(e);
  });

  return btn;
};

export const buttons = (btns: HTMLButtonElement[]) => {
  const btnContainer = document.createElement("div");
  btnContainer.classList.add(
    ...["absolute", "top-1", "left-1", "flex", "flex-col", "gap-0.5", "z-50"]
  );
  btnContainer.append(...btns);

  return btnContainer;
};
