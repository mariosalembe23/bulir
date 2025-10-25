import { deleteCookie } from "cookies-next";
import { toast } from "sonner";

export default function makeLogout() {
  toast.loading("A sair...");

  setTimeout(() => {
    toast.success("Sessão terminada com sucesso.");
  }, 2000);

  deleteCookie("bulir_token");
  window.location.href = "/";
}
