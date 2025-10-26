import { Service } from "@/app/profile/Types/Provider";
import openConfetti from "@/components/Partials/Confetti";
import ConvertMoneyFormat from "@/components/Partials/ConvertMoneyFormat";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { getCookie } from "cookies-next";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateServiceForm {
  title: string;
  description: string;
  price: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateService({
  open,
  setOpen,
  setServices,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateServiceForm>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const onSubmit = async (data: CreateServiceForm) => {
    // if (data.price <= 0 || data.price > 1000000) {
    //   toast.error("O preço deve estar entre 0 e 1.000.000.");
    //   return;
    // }

    try {
      setLoading(true);
      const dataToSend = {
        title: data.title,
        description: data.description,
        price: data.price,
      };

      const response = await axios.post(
        `${BASE_URL}/services/create`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("bulir_token")}`,
          },
        }
      );
      toast.success("Serviço criado com sucesso!");
      setServices((prevServices) => [response.data, ...prevServices]);
      setOpen(false);
      openConfetti();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response?.status >= 400 &&
          error.response?.status < 500
        ) {
          toast.error(
            error.response.data.error ||
              "Erro de autenticação. Verifique suas credenciais."
          );
        } else {
          toast.error(
            "Ocorreu um erro. Por favor, tente novamente mais tarde."
          );
        }
      } else {
        toast.error("Ocorreu um erro. Por favor, tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            <svg
              className="size-6"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.80312 0H29.4627C33.7781 0 37.2658 3.49958 37.2658 7.80312V29.4627C37.2658 33.7781 33.7662 37.2658 29.4627 37.2658H7.80312C3.48776 37.2658 0 33.7662 0 29.4627V7.80312C0 3.49958 3.49958 0 7.80312 0Z"
                fill="#31ECC6"
              />
              <path
                d="M22.901 20.5722C22.4636 20.5722 22.1089 20.2175 22.1207 19.7801C22.1207 18.4913 22.1207 14.6252 22.0735 13.5021C21.967 10.4281 19.4133 8.01624 16.1265 7.89801C12.8989 7.7916 10.085 10.2035 9.97862 13.1829C9.91948 14.7789 9.88399 16.4578 9.87225 18.5386C10.2151 18.5386 10.5579 18.5386 10.889 18.5386C11.2201 18.5386 11.5511 18.5386 11.8584 18.5386H15.8073C16.2448 18.5741 16.5758 18.9524 16.5403 19.3899C16.5167 19.7801 16.1975 20.0993 15.8073 20.1229H11.8821C11.5747 20.1229 11.2201 20.1229 10.8653 20.1229C10.5106 20.1229 10.085 20.1229 9.70666 20.1229H9.16282H9.10368C8.89094 20.1347 8.67812 20.0519 8.52436 19.8983C8.37068 19.7446 8.28796 19.5436 8.28796 19.3308C8.28796 16.848 8.33519 14.9208 8.40616 13.1001C8.54801 9.26949 12.1067 6.13639 16.1975 6.29009C20.2882 6.44379 23.5395 9.50596 23.6695 13.4193C23.7168 14.6607 23.7287 18.645 23.7168 19.7682C23.7287 20.2056 23.374 20.5722 22.9365 20.584C22.9247 20.5722 22.9129 20.5722 22.901 20.5722Z"
                fill="#0C2340"
              />
              <path
                d="M21.081 30.9634H8.9034C8.46593 30.9279 8.13492 30.5496 8.17032 30.1121C8.19398 29.7219 8.51325 29.4027 8.9034 29.3791H23.8948C26.7914 29.3554 28.8132 28.0904 29.8773 25.6903C30.9413 23.2903 30.5629 21.0558 28.7777 19.0813C27.9265 18.1 26.7442 17.4498 25.4554 17.2488C25.0299 17.1779 24.7342 16.7759 24.7934 16.3502C24.8524 15.9246 25.2663 15.6291 25.6919 15.6882C27.3353 15.9482 28.8368 16.764 29.9363 18.0173C32.1472 20.4646 32.6319 23.3376 31.3196 26.3288C30.0073 29.32 27.4299 30.9279 23.8948 30.9634H21.081Z"
                fill="#0C2340"
              />
              <path
                d="M15.9842 23.8467H8.73676C8.29937 23.8821 7.92101 23.551 7.88554 23.1136C7.85007 22.6762 8.18109 22.2979 8.61856 22.2624C8.65404 22.2624 8.70135 22.2624 8.73676 22.2624H15.9842C16.4217 22.2269 16.8 22.5579 16.8355 22.9954C16.871 23.4328 16.5399 23.8112 16.1024 23.8467C16.0552 23.8585 16.0197 23.8585 15.9842 23.8467Z"
                fill="#0C2340"
              />
              <path
                d="M16.1626 27.097H8.9034C8.46593 27.0615 8.13492 26.6832 8.17032 26.2457C8.19398 25.8555 8.51325 25.5364 8.9034 25.5127H16.1626C16.6001 25.5482 16.9311 25.9265 16.8956 26.364C16.8602 26.7541 16.5528 27.0733 16.1626 27.097Z"
                fill="#0C2340"
              />
            </svg>
            Novo Serviço
          </AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos para criar um novo serviço.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 space-y-4 grid grid-cols-2 gap-4"
        >
          <div className="*:not-first:mt-2">
            <Label
              htmlFor={"title"}
              className="text-primary font-[450] text-[15px]"
            >
              Título do Serviço
            </Label>
            <Input
              id={"title"}
              {...register("title", {
                required: "Este campo é obrigatório",
                minLength: {
                  value: 3,
                  message: "O título deve ter no mínimo 3 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "O título deve ter no máximo 100 caracteres",
                },
              })}
              className="py-5 focus:ring-4! text-base text-secondary focus:ring-contrast-ground! focus:border-primary/70!"
              placeholder="Título do serviço"
              type="text"
            />
            {errors.title && (
              <p className="text-red-700 ps-3 mt-1 text-sm">
                {errors.title.message}
              </p>
            )}
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
              {...register("price", {
                required: "Este campo é obrigatório",
                valueAsNumber: true, // 👈 converte o valor string para número
                min: {
                  value: 10,
                  message: "O preço deve ser maior ou igual a 10 kzs",
                },
                max: {
                  value: 1000000,
                  message: "O preço deve ser menor ou igual a 1.000.000 kzs",
                },
              })}
              className="py-5 focus:ring-4! text-base text-secondary focus:ring-contrast-ground! focus:border-primary/70!"
              placeholder="Preço do serviço"
              type="number"
            />
            {errors.price ? (
              <p className="text-red-700 ps-3 mt-1 text-sm">
                {errors.price.message}
              </p>
            ) : (
              <p className="ps-3 text-sm text-primary pt-1">
                {ConvertMoneyFormat(watch("price"))}
              </p>
            )}
          </div>
          <div className="*:not-first:mt-2 col-span-2">
            <Label
              htmlFor={"description"}
              className="text-primary font-[450] text-[15px]"
            >
              Descrição do Serviço
            </Label>
            <Textarea
              id={"description"}
              {...register("description", {
                required: "Este campo é obrigatório",
                minLength: {
                  value: 10,
                  message: "A descrição deve ter no mínimo 10 caracteres",
                },
                maxLength: {
                  value: 250,
                  message: "A descrição deve ter no máximo 1000 caracteres",
                },
              })}
              placeholder="Descrição do serviço"
              className="field-sizing-content shadow-none! py-2 focus:ring-4! text-base text-secondary focus:ring-contrast-ground! focus:border-primary/70! max-h-30.5 min-h-0 resize-none"
            />
            {errors.description && (
              <p className="text-red-700 ps-3 mt-1 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid col-span-2 grid-cols-1 ret:grid-cols-2 gap-2">
            <Button
              onClick={() => setOpen(false)}
              variant={"outline"}
              type="button"
              className="py-5 w-full"
            >
              Cancelar
            </Button>

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
              Criar Serviço
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
