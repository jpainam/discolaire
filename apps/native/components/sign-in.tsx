/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useForm } from "@tanstack/react-form";
import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  Surface,
  TextField,
  useToast,
} from "heroui-native";
import { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { Text, View } from "react-native";
import z from "zod";

import { authClient } from "@/utils/auth-client";
import { queryClient } from "@/utils/trpc";

const signInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

interface SignInProps {
  onSuccess?: () => void | Promise<void>;
}

function SignIn({ onSuccess }: SignInProps) {
  const passwordInputRef = useRef<TextInput>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setSubmitError(null);
      await authClient.signIn.username(
        {
          username: value.username.trim().toLowerCase(),
          password: value.password,
          rememberMe: true,
        },
        {
          onError(error) {
            const message = error.error?.message || "Failed to sign in";
            setSubmitError(message);
            toast.show({
              variant: "danger",
              label: message,
            });
          },
          onSuccess() {
            setSubmitError(null);
            formApi.reset();
            toast.show({
              variant: "success",
              label: "Signed in successfully",
            });
            void queryClient.invalidateQueries();
            void onSuccess?.();
          },
        },
      );
    },
  });

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Sign In</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ isSubmitting }) => (
          <>
            <FieldError isInvalid={!!submitError} className="mb-3">
              {submitError}
            </FieldError>

            <View className="gap-3">
              <form.Field name="username">
                {(field) => {
                  const fieldError = getErrorMessage(field.state.meta.errors);

                  return (
                    <TextField isInvalid={!!fieldError}>
                      <Label>Username</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="username"
                        autoCapitalize="none"
                        autoComplete="username"
                        textContentType="username"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                      <FieldError>{fieldError}</FieldError>
                    </TextField>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const fieldError = getErrorMessage(field.state.meta.errors);

                  return (
                    <TextField isInvalid={!!fieldError}>
                      <Label>Password</Label>
                      <Input
                        ref={passwordInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                      />
                      <FieldError>{fieldError}</FieldError>
                    </TextField>
                  );
                }}
              </form.Field>

              <Button
                onPress={form.handleSubmit}
                isDisabled={isSubmitting}
                className="mt-1"
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="default" />
                ) : (
                  <Button.Label>Sign In</Button.Label>
                )}
              </Button>
            </View>
          </>
        )}
      </form.Subscribe>
    </Surface>
  );
}

export { SignIn };
