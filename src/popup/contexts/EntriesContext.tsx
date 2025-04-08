import { useAtomValue } from "jotai";
import { createContext, useContext, type PropsWithChildren } from "react";

import { useCloudEntriesQuery } from "~popup/hooks/useCloudEntriesQuery";
import { entriesAtom, transitioningEntryContentHashAtom } from "~popup/states/atoms";
import type { Entry } from "~types/entry";
import db from "~utils/db/react";

const EntriesContext = createContext<Entry[]>([]);

export const EntriesProvider = ({ children }: PropsWithChildren) => {
  const connectionStatus = db.useConnectionStatus();
  const transitioningEntryContentHash = useAtomValue(transitioningEntryContentHashAtom);
  const entries = useAtomValue(entriesAtom);
  const cloudEntriesQuery = useCloudEntriesQuery();
  const cloudEntries = connectionStatus === "closed" ? [] : cloudEntriesQuery.data?.entries || [];

  return (
    <EntriesContext.Provider value={cloudEntries.slice().sort((a, b) => b.createdAt - a.createdAt)}>
      {children}
    </EntriesContext.Provider>
  );
};

export const useEntries = () => {
  return useContext(EntriesContext);
};
