import { useAtomValue } from "jotai";

import { refreshTokenAtom } from "~popup/states/atoms";
import db from "~utils/db/react";

export const useCloudTaggedEntriesQuery = () => {
  const { user } = db.useAuth();

  return db.useQuery(
    user
      ? {
          entries: {
            $: {
              where: {
                "$user.id": user.id,
                tags: {
                  $isNull: false,
                },
              },
            },
          },
        }
      : null,
  );
};
