export type UpdateHandler = () => void;

type UpdatesSytem = {
  addUpdate: (handler: UpdateHandler) => number;
  addPostUpdate: (handler: UpdateHandler) => number;
  removeUpdate: (callback: UpdateHandler) => void;
  removePostUpdate: (callback: UpdateHandler) => void;
  update: () => void;
  postUpdate: () => void;
};

export const createUpdatesSystem = (): UpdatesSytem => {
  const updateHandlers: UpdateHandler[] = [];
  const postUpdateHandlers: UpdateHandler[] = [];

  const addUpdate = (handler: UpdateHandler) => updateHandlers.push(handler);
  const addPostUpdate = (handler: UpdateHandler) =>
    postUpdateHandlers.push(handler);

  const removeUpdate = (callback: UpdateHandler) => {
    updateHandlers.splice(updateHandlers.indexOf(callback), 1);
  };

  const removePostUpdate = (callback: UpdateHandler) => {
    postUpdateHandlers.splice(postUpdateHandlers.indexOf(callback), 1);
  };

  const update = () => {
    for (const handler of updateHandlers) {
      handler();
    }
  };

  const postUpdate = () => {
    for (const handler of postUpdateHandlers) {
      handler();
    }
  };

  return {
    addUpdate,
    addPostUpdate,
    removeUpdate,
    removePostUpdate,
    update,
    postUpdate,
  };
};

let instance: UpdatesSytem | null = null;

export const updatesSystem = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createUpdatesSystem();

  return instance;
};
