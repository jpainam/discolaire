import React from "react";

import { TRPCProvider } from "~/utils/api";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <Providers>{children}</Providers>
    </TRPCProvider>
  );
}

const compose = (providers: React.FC<{ children: React.ReactNode }>[]) =>
  providers.reduce((Prev, Curr) => ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const Provider = Prev ? (
      <Prev>
        <Curr>{children}</Curr>
      </Prev>
    ) : (
      <Curr>{children}</Curr>
    );
    return Provider;
  });

const Providers = compose([]);
