import { Alert } from "react-native";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const baseUrl = "https://school.discolaire.com";

interface BackendUser {
  avatar: null;
  createdAt: string;
  email: string;
  exp: number;
  iat: number;
  id: string;
  isActive: boolean;
  isEmailVerified: boolean;
  jti: string;
  name: string;
  sub: string;
  updatedAt: string;
}

export const onSubmit = async () => {
  const username = "jpainam@gmail.com";
  const csrfRequest: {
    csrfToken: string;
  } = (await fetch(`${baseUrl}/api/auth/csrf`).then((res) => res.json())) as {
    csrfToken: string;
  };

  const body = Object.entries({
    csrfToken: csrfRequest.csrfToken,
    username: encodeURIComponent("jpainam@gmail.com"),
    password: encodeURIComponent("admin1234"),
    callbackUrl: encodeURIComponent("/"),
    redirect: false,
    json: true,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  try {
    const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials?`, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: body,
      method: "POST",
      credentials: "include",
    });
    // @ts-check-ignore TODO fix this
    const setCookieHeader = loginRes.headers.get("set-cookie");
    if (setCookieHeader) {
      // Find the position of the session token key
      const tokenStart =
        setCookieHeader.indexOf("__Secure-next-auth.session=") +
        "__Secure-next-auth.session=".length;
      // Find the position of the semicolon after the token
      const tokenEnd = setCookieHeader.indexOf(";", tokenStart);
      // Extract the token
      const longSessionToken = setCookieHeader.substring(tokenStart, tokenEnd);

      console.log(longSessionToken); // This is your LONG_SESSION_TOKEN
    }
    if (loginRes.status === 200) {
      const userInfo: { expires: string; user?: BackendUser } = await fetch(
        `${baseUrl}/api/auth/session`,
      ).then((res) => res.json());

      if (userInfo.user?.email !== username) {
        Alert.alert("Login failed! Please check your username and password!");
        return;
      }
      //localStorage.setItem("userInfo", JSON.stringify(userInfo));
      Alert.alert("Login success!");
      const response = await fetch(`${baseUrl}/api/trpc/student.all`).then(
        (res) => res.json(),
      );
      console.log(response);
    } else {
      Alert.alert("Login failed! " + loginRes.statusText);
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Login failed!");
  }
};
