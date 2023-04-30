import { logger } from "@srpg-engine/logger";

export type MessageHandler = <Sender = object, Data = unknown>(
  sender: Sender,
  data: Data
) => void;

export class SenderTable extends Map<object, MessageHandler[]> {
  constructor() {
    super();
  }
}

const { logError, logWarning } = logger("messenger");
const defaultSender = { default: true };

export type Messenger = Readonly<{
  _senderTables: Map<string, SenderTable>;
}> & {
  addObserver: (
    message: string,
    handler: MessageHandler,
    sender?: object
  ) => void;

  removeObserver: (
    message: string,
    handler: MessageHandler,
    sender?: object
  ) => void;

  clean: () => void;
  emit: (message: string, sender?: object, data?: unknown) => void;
};

export const createMessenger = (): Messenger => {
  const senderTables = new Map<string, SenderTable>();
  const invoking = new Set<MessageHandler[]>();

  const addObserver = (
    message: string,
    handler: MessageHandler,
    sender?: object
  ) => {
    if (!message) {
      logError("Can't observe a message with no type", {
        message,
        handler,
        sender,
      });

      return;
    }

    if (!senderTables.has(message)) {
      senderTables.set(message, new SenderTable());
    }

    const table = senderTables.get(message);
    if (!table) {
      logError("Error getting sender table", {
        message,
        handler,
        sender,
        senderTables,
        table,
      });

      return;
    }

    const key = sender ?? defaultSender;
    if (!table.has(key)) {
      table.set(key, []);
    }

    const list = table.get(key);
    if (!list) {
      logError("Error getting sender list", {
        message,
        handler,
        sender,
        table,
        key,
        list,
      });

      return;
    }

    if (!list.includes(handler)) {
      if (invoking.has(list)) {
        const next = [...list];
        table.set(key, next);
      }

      list.push(handler);
      table.set(key, list);
    }
  };

  const removeObserver = (
    message: string,
    handler: MessageHandler,
    sender?: object
  ) => {
    if (!message) {
      logError("Can't stop observing a message with no type", {
        message,
        handler,
        sender,
      });

      return;
    }

    if (!senderTables.has(message)) {
      return;
    }

    const table = senderTables.get(message);
    const key = sender ?? defaultSender;

    if (!table?.has(key)) {
      return;
    }

    const list = table.get(key) ?? [];
    const index = list.indexOf(handler);
    if (index >= 0) {
      if (invoking.has(list)) {
        const next = [...list];
        table.set(key, next);
      }

      list.splice(index, 1);
      table.set(key, list);
    }
  };

  const clean = () => {
    const not = [...senderTables.keys()];

    for (const message of not) {
      const table = senderTables.get(message);
      if (!table) {
        continue;
      }

      const keys = table.keys();
      for (const sender of keys) {
        const list = table.get(sender);
        if (!list) {
          continue;
        }

        if (list.length === 0) {
          table.delete(sender);
        }
      }

      if (table.size === 0) {
        senderTables.delete(message);
      }
    }
  };

  const emit = (message: string, sender?: object, data?: unknown) => {
    if (!message) {
      logError("Can't post a message with no type", {
        message,
        sender,
        data,
      });

      return;
    }

    if (!senderTables.has(message)) {
      logWarning(
        "Message is not being observed",
        {
          message,
          sender,
          data,
        },
        true
      );

      return;
    }

    const table = senderTables.get(message);
    if (!table) {
      logWarning("Message is not being observed", {
        message,
        sender,
        senderTables,
        table,
      });

      return;
    }

    const key = sender ?? defaultSender;
    const list = table.get(key) ?? [];

    if (list.length > 0) {
      invoking.add(list);

      for (const handler of list) {
        handler(sender, data);
      }

      invoking.delete(list);
    }
  };

  return {
    _senderTables: senderTables,
    addObserver,
    removeObserver,
    clean,
    emit,
  };
};

let instance: Messenger | null = null;
export const messenger = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createMessenger();
  return instance;
};
