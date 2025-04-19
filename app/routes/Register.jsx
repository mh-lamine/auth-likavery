import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "react-router";
import { redirect, Link } from "react-router";
import { pb } from "@/lib/pbconfig";
import { SITES_URLS } from "@/lib/enums";

export async function action({ request }) {
  const formData = await request.formData();
  const { email, password, passwordConfirm, role } =
    Object.fromEntries(formData);

  if (!email || !password || !passwordConfirm || !role) {
    return { error: "Veuillez remplir tous les champs." };
  }

  try {
    const record = await pb.collection("users").create(formData);
    console.log(record);
    return redirect(SITES_URLS.login);
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export default function Register({ actionData }) {
  return (
    <Form
      method="post"
      className="flex flex-col items-center gap-4 w-4/5 max-w-md"
    >
      <h2 className="text-2xl font-medium">Créer un compte</h2>
      <Input type="hidden" name="role" value="pharma" />
      <Input type="text" name="email" placeholder="Email" />
      <Input type="password" name="password" placeholder="Mot de passe" />
      <Input
        type="password"
        name="passwordConfirm"
        placeholder="Confirmer le mot de passe"
      />
      <Button type="submit" className="w-full">
        Créer un compte
      </Button>
      <Button asChild variant="outline" type="link" className="w-full">
        <Link to="/">Se connecter</Link>
      </Button>
      <Button asChild variant="link" type="link" className="w-full">
        <Link to={SITES_URLS.patient}>Retourner à l'accueil</Link>
      </Button>
      {actionData?.error && <p>{actionData.error.message}</p>}
    </Form>
  );
}
