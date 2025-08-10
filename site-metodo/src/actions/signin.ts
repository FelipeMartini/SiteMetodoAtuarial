"use server";

import { redirect } from "next/navigation";
import { signIn } from "../../auth";

/**
 * Server action for credentials sign in with Auth.js v5
 */
export type SignInCredentialsResult =
  | {
      status: "error";
      errorMessage: string;
    }
  | undefined;

export async function signInCredentials(
  previousState: SignInCredentialsResult | null,
  formData: FormData,
): Promise<SignInCredentialsResult> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        status: "error",
        errorMessage: "Email e senha são obrigatórios",
      };
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      return {
        status: "error",
        errorMessage: "Falha na autenticação. Verifique suas credenciais.",
      };
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return {
      status: "error",
      errorMessage: "Falha na autenticação. Verifique suas credenciais.",
    };
  }

  redirect("/area-cliente");
}

/**
 * Server action for OAuth sign in with Auth.js v5
 */
export async function signInOAuth({ providerId }: { providerId: string }) {
  try {
    // Validate provider ID
    const allowedProviders = ["google", "github"];
    if (!allowedProviders.includes(providerId)) {
      return {
        status: "error",
        errorMessage: "Provider não suportado",
      } as const;
    }

    const redirectUrl = await signIn(providerId, {
      redirect: false,
    });

    if (!redirectUrl) {
      return {
        status: "error",
        errorMessage: "Falha no login, URL de redirecionamento não encontrada",
      } as const;
    }

    redirect(redirectUrl);
  } catch (error) {
    console.error("Erro na autenticação OAuth:", error);
    return {
      status: "error",
      errorMessage: "Falha no login OAuth",
    } as const;
  }
}

/**
 * Server action for email sign in with Auth.js v5
 */
export type SignInEmailResult =
  | {
      status: "error";
      errorMessage: string;
    }
  | undefined;

export async function signInEmail(
  previousState: SignInEmailResult | null,
  formData: FormData,
): Promise<SignInEmailResult> {
  try {
    const email = formData.get("email");

    if (!email) {
      return {
        status: "error",
        errorMessage: "Email é obrigatório",
      };
    }

    const redirectUrl = await signIn("email", {
      redirect: false,
      email,
    });

    if (!redirectUrl) {
      return {
        status: "error",
        errorMessage: "Falha no envio do email de login",
      };
    }
  } catch (error) {
    console.error("Erro no login por email:", error);
    return {
      status: "error",
      errorMessage: "Falha no envio do email de login",
    };
  }

  redirect("/verify-request");
}
