import { useEffect } from "react";
import { Button } from "react-native";
import { router } from "expo-router";

import ScreenWrapper from "~/components/ScreenWrapper";
import { View } from "~/components/Themed";
import { useUser } from "~/utils/auth";
import { setToken } from "~/utils/session-store";
import { onSubmit } from "./submit-login";

const token =
  "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiVk5aMElVRERfVXRYR0tIX0xkN0ozaklCazRpRm5ad2F5SnRrNy02UnB2anBSbi1IYjZCVVNCemdVN3pjTVhXeHp4VnhMRG0tM0pnOVd2QS11a3VfblEifQ..Q-En09VdiqUz5B-GPQBeOQ.Visx2cXqrWFBIhc-r5vYir8B46uzq9CgOrOU45OmSiL61iAK9BMeckeE1k5KCA8hONC4LBEtCB92JeILeYAVk4qc7N-XxPUTC5RG6pNHfIPhN5c322A_MO7VAERMhYvEffKw1H1u5h8qPcl-JPnC9ICN-XbM8Gi7KlVLHSHp7omlyJk8hezWHtrGB1fxEvrD0gXpPu9YcjeUDSX76EHYst8M-0YBx4sIA1BLb5E_pcJsk1zN2hmoZD2txUhWPi5E_PhvE_BoZv-cE0azH8tEctCvG3RKwiVnBSWlpvSPMl7SquxcYzqktjr1R_wOHNoYHPGrcmUqm6VEQPrsUB2g0UQyLR7stXAg3jhIX-9ge80OCuXGebKMXNbQ2vlzL1gM8tM8cO0eY_M5pVR22Kds22cYNiyEofPoX4naoYqevu_RZ9nlNWhebFh-cXzxNkmcZXPo0c4m9Py1tpyh-LKAyf_w8WNfw_5GXBSwJ9W6fyY.TKte59BsVX3UrjoSTQmGRb343JnQ3-Q7tamlvwH3Dik";
export default function Page() {
  useEffect(() => {
    setToken(token);
  }, []);
  const user = useUser();
  useEffect(() => {
    if (user) {
      console.log(user);
      router.replace("/");
    }
  }, [user]);
  return (
    <ScreenWrapper>
      <View>
        <Button
          title="login"
          onPress={() => {
            void onSubmit();
          }}
        />
      </View>
    </ScreenWrapper>
  );
}
