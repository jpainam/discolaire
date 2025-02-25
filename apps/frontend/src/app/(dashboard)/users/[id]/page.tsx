import { Separator } from "@repo/ui/components/separator";

import { ProfileForm } from "~/components/users/profile-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}

// export default function Page() {
//   return (
//     <div>
//       Verifier si l'utilisateur est l'utilisateur courant, si oui, continuer.
//       <br />
//       Sinon verifier s'il a le droit voir tous les utilisateur? Si oui,
//       continuer,
//       <br />
//       sinon Verifier s'il a l droit d voir cette utilisateur en particulier, si
//       oui, continuer,
//       <br />
//       Vous n'avez pas le droit de voir cette page.
//     </div>
//   );
// }
