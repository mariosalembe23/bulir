import openConfetti from "@/components/Partials/Confetti";
import InvisibleLoad from "@/components/Partials/InvisibleLoad";
import {
  AlertDialog,
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
import axios from "axios";
import { getCookie } from "cookies-next";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateBooking({
  open,
  setOpen,
  clientId,
  serviceId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientId?: string;
  serviceId?: string;
}) {
  const [date, setDate] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const createBooking = async () => {
    if (!clientId || !serviceId) return;

    if (clientId === serviceId) {
      toast.error("Você não pode solicitar um serviço para si mesmo.");
      return;
    }

    if (!date) {
      toast.error("Por favor, insira uma data para o serviço.");
      return;
    }

    if (new Date(date) < new Date()) {
      toast.error("A data do serviço não pode ser no passado.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/bookings/create`,
        {
          clientId,
          serviceId,
          date,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("bulir_token")}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Serviço solicitado com sucesso!");
      openConfetti();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {loading && <InvisibleLoad />}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">
            Solicitar Serviço
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base -mt-1">
            Insira a data desejada para o serviço e confirme sua solicitação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form>
          <div>
            <Label htmlFor="date" className="ps-2 text-[15px]">
              Data do Serviço
            </Label>
            <Input
              id={"name"}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="py-5 mt-2 focus:ring-4! w-full text-base text-secondary focus:ring-contrast-ground! focus:border-primary/70!"
              placeholder="Insira o seu nome completo"
              type="date"
            />
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            onClick={() => {
              createBooking();
            }}
          >
            {loading && (
              <LoaderCircleIcon
                className="-ms-1 animate-spin"
                size={16}
                aria-hidden="true"
              />
            )}
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
