// app/auth-context.tsx
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import type { RouterOutputs } from "~/utils/api";
import { authClient, useSignOut } from "~/utils/auth";

type SessionType = RouterOutputs["auth"]["getSession"];
interface AuthContextType {
  session: SessionType;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //const [session, setSession] = useState<SessionType>(null);
  //const [isLoading, setIsLoading] = useState(true);

  const signOut = useSignOut();
  //const segments = useSegments();
  const { data: session, isPending } = authClient.useSession();
  //const sessionQuery = useQuery(trpc.auth.getSession.queryOptions());

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session?.user,
        loading: isPending,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used within AuthProvider");
  return ctx;
};
