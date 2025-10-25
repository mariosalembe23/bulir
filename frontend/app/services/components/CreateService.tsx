import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CreateService({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Novo Serviço</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos para criar um novo serviço.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form className="mt-3 space-y-8 grid grid-cols-2 gap-4">
          <div className="*:not-first:mt-2">
            <Label
              htmlFor={"title"}
              className="text-primary font-[450] text-[15px]"
            >
              Título do Serviço
            </Label>
            <Input
              id={"title"}
              // {...register("email", { required: "Este campo é obrigatório" })}
              className="py-5 focus:ring-4! text-base text-secondary focus:ring-contrast-ground! focus:border-primary/70!"
              placeholder="Título do serviço"
              type="text"
            />
            {/* {errors.email && (
                <p className="text-red-700 ps-3 mt-1 text-sm">
                  {errors.email.message}
                </p>
              )} */}
          </div>
          <div className="*:not-first:mt-2">
            <Label
              htmlFor={"price"}
              className="text-primary font-[450] text-[15px]"
            >
              Preço
            </Label>
            <Input
              id={"price"}
              // {...register("email", { required: "Este campo é obrigatório" })}
              className="py-5 focus:ring-4! text-base text-secondary focus:ring-contrast-ground! focus:border-primary/70!"
              placeholder="Preço do serviço"
              type="text"
            />
            {/* {errors.email && (
                <p className="text-red-700 ps-3 mt-1 text-sm">
                  {errors.email.message}
                </p>
              )} */}
          </div>
          

          <div className="grid grid-cols-1 ret:grid-cols-2 gap-2">
            <Link href={"/register"} className="w-full ret:order-1 order-2">
              <Button variant={"outline"} type="button" className="py-5 w-full">
                Criar Conta
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-primary ret:order-2 order-1 py-5 text-white hover:bg-secondary"
            >
              {loading && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Iniciar Sessão
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Link
              href={"/"}
              className="text-[15px] text-gray-700 hover:underline"
            >
              Esqueci a minha palavra-chave
            </Link>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
