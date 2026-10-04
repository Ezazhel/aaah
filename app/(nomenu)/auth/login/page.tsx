import { LoginForm } from "./login-form";

export default async function Login({ searchParams }: PageProps<"/auth/login">) {
  const { error } = await searchParams;
  return <LoginForm membershipExpired={error === 'membership'} />;
}
