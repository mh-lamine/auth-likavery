import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, redirect, Link } from "react-router";
import { pb } from "@/lib/pbconfig";
import { SITES_URLS } from "@/lib/enums";

export function meta() {
  return [
    { title: "Likavery | Connectez-vous ou créez un compte" },
    {
      name: "description",
      content: "Accédez à votre espace personnel en toute sécurité !",
    },
  ];
}

export async function action({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  try {
    const { record, token } = await pb
      .collection("users")
      .authWithPassword(email, password);

    return redirect(SITES_URLS[record.role], {
      headers: {
        "Set-Cookie": `authData=${JSON.stringify({
          token,
          record,
        })}; HttpOnly; Path=*; Max-Age=2592000; SameSite=Lax; `,
      },
    });
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export default function Login({ actionData }) {
  return (
    <Form
      method="post"
      className="flex flex-col items-center gap-4 w-4/5 max-w-md"
    >
      <h2 className="text-2xl font-medium">Se connecter</h2>
      <Input
        type="text"
        name="email"
        placeholder="Nom d'utilisateur ou email"
      />
      <Input type="password" name="password" placeholder="Mot de passe" />
      <Button type="submit" className="w-full">
        Se connecter
      </Button>
      <Button asChild variant="outline" type="link" className="w-full">
        <Link to="/register">Créer un compte</Link>
      </Button>
      <Button asChild variant="link" type="link" className="w-full">
        <Link to={SITES_URLS.patient}>Retourner à l'accueil</Link>
      </Button>
      {actionData?.error && <p>{actionData.error.message}</p>}
    </Form>
  );
}
