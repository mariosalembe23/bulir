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
import { Label } from "@/components/ui/label";
import axios from "axios";
import { getCookie } from "cookies-next";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConvertMoneyFormat from "@/components/Partials/ConvertMoneyFormat";
import { User } from "@/app/profile/[id]/page";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const options = [
  { value: 10000, label: "10000" },
  { value: 50000, label: "50000" },
  { value: 100000, label: "100000" },
];

export default function AddBalance({
  open,
  setOpen,
  setUser,
  userId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userId: string;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = React.useState<number>(
    options[0].value
  );

  const createBooking = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/update-balance/` + userId,
        {
          balance: selectedAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("bulir_token")}`,
          },
        }
      );
      toast.success("Saldo adicionado!");
      openConfetti();
      setOpen(false);
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            balance: (prevUser.balance || 0) + selectedAmount,
          };
        }
        return prevUser;
      });
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
            Adicionar Saldo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-primary -mt-1">
            Selecione o valor que deseja adicionar ao seu saldo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
            <Label htmlFor={"balance"}>Valor a adicionar ao saldo</Label>
            <Select
              onValueChange={(value) => setSelectedAmount(Number(value))}
              value={selectedAmount.toString()}
            >
              <SelectTrigger id={"balance"}>
                <SelectValue placeholder="Selecione um valor" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {ConvertMoneyFormat(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Adicionar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
