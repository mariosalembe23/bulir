import { User } from "@/app/profile/[id]/page";
import { Booking } from "@/app/profile/Types/Provider";
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
import { getCookie, setCookie } from "cookies-next";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateBooking({
  open,
  setOpen,
  clientId,
  serviceId,
  price,
  userBalance,
  setBookings,
  setUser,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientId: string;
  serviceId: string;
  price: number;
  userBalance: number;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const [date, setDate] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const createBooking = async () => {
    if (!clientId || !serviceId) {
      return toast.error("Dados do cliente ou serviço ausentes.");
    }

    if (clientId === serviceId) {
      toast.error("Você não pode solicitar um serviço para si mesmo.");
      return;
    }

    if (userBalance && price && userBalance < price) {
      toast.error("Saldo insuficiente. Carregue sua conta para continuar.");
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

    if (userBalance < price) {
      toast.error("Saldo insuficiente para solicitar este serviço.");
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
      toast.success("Serviço solicitado com sucesso!");
      setBookings((prev) => [...prev, response.data]);
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            balance: (prevUser.balance || 0) - price,
          };
        }
        return prevUser;
      });
      
      setOpen(false);
      setCookie("booking_created", "true");
      window.location.href = "/profile/" + clientId;
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
        <div>
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
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={createBooking}>
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
