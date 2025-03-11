import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@instantdb/react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Image,
  PinInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPencilMinus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { match } from "ts-pattern";
import { z } from "zod";

import { App } from "~popup/App";
import db from "~utils/db/react";
import env from "~utils/env";

const schema = z.object({
  email: z.string(),
  code: z.string(),
});
type FormValues = z.infer<typeof schema>;

export default function Page() {
  const auth = db.useAuth();

  const [step, setStep] = useState<0 | 1>(0);
  const [subscriptionsQueryIsLoading, setSubscriptionsQueryIsLoading] = useState(true);

  const {
    control,
    setError,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      code: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ email, code }) => {
    await match(step)
      .with(0, async () => {
        try {
          await db.auth.sendMagicCode({ email });
        } catch (e) {
          console.log(e);

          setError("email", { type: "manual", message: "Invalid email" });

          return;
        }

        setStep(1);
      })
      .with(1, async () => {
        try {
          await db.auth.signInWithMagicCode({ email, code });
        } catch (e) {
          console.log(e);

          setError("code", { type: "manual", message: "Invalid code" });
          setValue("code", "");

          return;
        }

        // Reset step and form so it can be reused if the user signs out from the popup while this
        // page is still open.
        setStep(0);
        setSubscriptionsQueryIsLoading(true);
        reset();
      })
      .exhaustive();
  };

  const redirectIfNotSubsribed = async (user: User) => {
    const { data } = await db.queryOnce({
      subscriptions: {},
    });

    // Only show success message if the user already has an active subscription.
    if (data.subscriptions.length) {
      setSubscriptionsQueryIsLoading(false);

      return;
    }

    window.location.replace(`${env.BASE_URL}/checkout/${user.id}`);
  };

  useEffect(() => {
    if (!auth.user) {
      return;
    }

    redirectIfNotSubsribed(auth.user);
  }, [auth.user]);

  if (auth.isLoading) {
    return null;
  }

  return auth.user ? (
    subscriptionsQueryIsLoading ? null : (
      <App />
    )
  ) : (
    <Center h="100%">
      <Card w={400} px={40} py={32} shadow="md" withBorder>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack p="xs" spacing="xl">
            {match(step)
              .with(0, () => (
                <Stack align="center" spacing={0}>
                  <Image src="/icon.png" maw={32} mb="md" alt="Clipboard History IO Logo" />
                  <Text fw="bold" mb={2}>
                    Sign in to Clipboard History IO Pro
                  </Text>
                  <Text color="dimmed" fz="xs">
                    Welcome! Please enter your email to continue
                  </Text>
                </Stack>
              ))
              .with(1, () => (
                <Stack align="center" spacing={0}>
                  <Text fw="bold" mb={4}>
                    Check your email
                  </Text>
                  <Text color="dimmed" fz="xs">
                    to continue to Clipboard History IO Pro
                  </Text>
                  <Group align="center" spacing={0}>
                    <Text color="dimmed" fz="xs">
                      {watch("email")}
                    </Text>
                    <ActionIcon
                      variant="transparent"
                      color="indigo"
                      onClick={() => {
                        setStep(0);
                        reset();
                      }}
                    >
                      <IconPencilMinus size="1rem" />
                    </ActionIcon>
                  </Group>
                </Stack>
              ))
              .exhaustive()}
            <Controller
              name="email"
              control={control}
              render={({ field }) =>
                step === 0 ? (
                  <TextInput
                    {...field}
                    label="Email address"
                    size="xs"
                    error={errors.email?.message}
                    required
                    autoFocus
                  />
                ) : (
                  <></>
                )
              }
            />
            <Controller
              name="code"
              control={control}
              render={({ field }) =>
                step === 1 ? (
                  <Stack align="center" spacing="xs">
                    <PinInput
                      {...field}
                      length={6}
                      error={!!errors.code?.message}
                      // This is okay because `onComplete` is called when and only when the
                      // length of `value` is the same as the provided length. I was concerned
                      // by a potential race between `onComplete` and `onChange` but there is
                      // none because `onComplete` is called inside a `useEffect` that depends
                      // on `value` and not alongside `onChange`.
                      // https://github.com/mantinedev/mantine/blob/84e6d7177d221be47af5294b74e6dcdac8eb4f13/src/mantine-core/src/PinInput/PinInput.tsx#L252-L256
                      onComplete={() => handleSubmit(onSubmit)()}
                      required
                      autoFocus
                    />
                    {errors.code?.message && (
                      <Text size="xs" color="red">
                        {errors.code.message}
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <></>
                )
              }
            />
            <Button type="submit" size="xs" loading={isSubmitting} fullWidth>
              Continue
            </Button>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
