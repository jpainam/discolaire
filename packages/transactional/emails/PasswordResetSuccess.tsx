import {
  Body,
  Container,
  Heading,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function PasswordResetSuccess() {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-md py-10">
            <Section className="rounded-lg bg-white p-6 shadow-md">
              <Heading className="mb-4 text-center text-2xl font-semibold text-blue-600">
                Password Reset Successful
              </Heading>
              <Text className="mb-4 text-gray-700">Hello,</Text>
              <Text className="mb-4 text-gray-700">
                We wanted to let you know that your password has been
                successfully reset. You can now log in with your new password.
              </Text>
              <Section className="text-center">
                <Link
                  href="https://your-app.com/login"
                  className="inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Log In
                </Link>
              </Section>
              <Text className="mt-6 text-xs text-gray-500">
                If you did not request this change, please contact our support
                team immediately.
              </Text>
              <Text className="mt-2 text-xs text-gray-500">
                Thank you for using our service!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
