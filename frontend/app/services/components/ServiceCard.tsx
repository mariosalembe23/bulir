import ConvertMoneyFormat from "@/components/Partials/ConvertMoneyFormat";
import { Button } from "@/components/ui/button";
import { Bolt, Fingerprint, Settings, ShoppingCart, Trash } from "lucide-react";
import React, { useState } from "react";
import CreateBooking from "./CreateBooking";
import { User } from "@/app/profile/[id]/page";
import Image from "next/image";

export interface ServiceCardProps {
  id?: string;
  title: string;
  description: string;
  price: number;
  requestsCount?: number;
  isOwner?: boolean;
  userId?: string;
  clientId?: string;
  logedUserId?: string;
  userBalance: number;
  date?: string;
  owner?: User;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  isOwner,
  userId,
  clientId,
  logedUserId,
  userBalance,
  id,
  owner,
}) => {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  return (
    <div className="border flex flex-col justify-between p-5 rounded-2xl">
      <header className="flex items-center justify-between ">
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
        <div className="flex items-center gap-2">
          {userId === logedUserId && !isOwner && (
            <p className="flex size-6 items-center justify-center rounded-full bg-primary text-white">
              <Fingerprint className="inline size-4" />
            </p>
          )}
          <p className="text-secondary">{ConvertMoneyFormat(price)}</p>
        </div>
      </header>

      <footer className="mt-10">
        <span className="text-lg font-medium text-primary">{title}</span>
        <p className="mt-1 text-gray-600 text-[15px]">{description}</p>

        <button className="flex hover:opacity-80 flex-wrap items-center gap-4 my-2">
          {!isOwner && (
            <>
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-1 py-1 border">
                <Image
                  src={"https://avatar.iran.liara.run/public/1"}
                  width={100}
                  height={100}
                  alt="Avatar"
                  className="rounded-full border size-6"
                />
                <span className="pe-2 text-primary text-[15px] leading-none">
                  {owner?.name}
                </span>
              </div>
            </>
          )}
        </button>
        {isOwner ? (
          <div className="flex  items-center gap-2 flex-wrap">
            <Button variant={"outline"} className="w-full ret:w-auto  ">
              <Settings className="size-4 " />
              Editar Serviço
            </Button>

            <Button variant={"destructive"} className="w-full ret:w-auto ">
              <Trash className="size-4 " />
              Remover Serviço
            </Button>
          </div>
        ) : userId === logedUserId ? (
          <Button
            variant={"outline"}
            onClick={() => {
              window.location.href = `/profile/${logedUserId}`;
            }}
            className="w-full mt-3 text-base py-5"
          >
            <Bolt className="size-4 " />
            Editar Serviço
          </Button>
        ) : (
          <Button
            onClick={() => setOpenConfirm(true)}
            className="w-full mt-3 text-base py-5"
          >
            <ShoppingCart className="size-4 " />
            Solicitar Serviço
          </Button>
        )}
      </footer>
      <CreateBooking
        open={openConfirm}
        clientId={clientId!}
        serviceId={id!}
        setOpen={setOpenConfirm}
        price={price}
        userBalance={userBalance}
      />
    </div>
  );
};

export default ServiceCard;
