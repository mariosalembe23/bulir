import PendentCard from "@/app/services/components/PendentCard";
import ServiceCard from "@/app/services/components/ServiceCard";
import ConvertMoneyFormat from "@/components/Partials/ConvertMoneyFormat";
import { Button } from "@/components/ui/button";
import { Bolt, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User } from "../[id]/page";
import timeSince from "@/components/Partials/TimeSince";
import axios from "axios";
import { Booking, Service } from "./Provider";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import makeLogout from "@/components/Partials/Logout";
import AddBalance from "@/app/services/components/AddBalance";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ClientSlice: React.FC<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}> = ({ user, setUser }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [openAddBalance, setOpenAddBalance] = useState<boolean>(false);

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/services/all`, {
          headers: {
            Authorization: `Bearer ${getCookie("bulir_token")}`,
          },
        });
        setServices(response.data);
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
          toast.error(
            "Ocorreu um erro. Por favor, tente novamente mais tarde."
          );
        }
      } finally {
        setLoadingServices(false);
      }
    };

    const getAllBookings = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/bookings/all/` + user?.id,
          {
            headers: {
              Authorization: `Bearer ${getCookie("bulir_token")}`,
            },
          }
        );
        setBookings(response.data);
        console.log(response.data);
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
          }
        } else {
          toast.error(
            "Ocorreu um erro. Por favor, tente novamente mais tarde."
          );
        }
      } finally {
        setLoadingBookings(false);
      }
    };

    getAllServices();
    getAllBookings();
  }, [user?.id]);

  return (
    <div
      style={{
        backgroundImage: 'url("/images/back.jpg")',
      }}
      className="h-dvh bg-[#f5f5f5] bg-cover bg-center w-full pot:not-last:p-5"
    >
      <main className="bg-white flex flex-col justify-between p-5 w-full ring-8 ring-white/50 h-full pot:rounded-3xl shadow-2xl">
        <header className="px-3 pb-3 border-gray-100 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={"/"}>
              <svg
                className="size-9"
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
            </Link>
            <Link href={"/"}>
              <Button variant={"link"}>Página Inicial</Button>
            </Link>

            <Link href={"/services"}>
              <Button variant={"link"}>Serviços</Button>
            </Link>

            <Link href={"/services"}>
              <Button variant={"link"}>Histórico</Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundImage: 'url("/images/user.jpeg")',
              }}
              className="rounded-full bg-cover size-8"
            />
            <Button onClick={makeLogout} variant={"outline"}>
              Sair
            </Button>
          </div>
        </header>
        <section className="h-full lal:pt-0 pt-10 lal:p-10 grid grid-cols-1 pot:gap-0 gap-24 pot:grid-cols-3 lal:grid-cols-[30%_40%_30%] overflow-y-auto">
          <div className="pot:p-5 p-1 pot:order-1 order-2">
            <header>
              <h3 className="text-2xl font-semibold text-primary ">
                Serviços Pendentes
              </h3>
              <p className="text-gray-600">
                Aqui estão os serviços que você solicitou e que ainda estão
                pendentes de conclusão.
              </p>
            </header>
            {loadingBookings ? (
              <div className="mt-5 flex items-center justify-start w-full">
                <p className="flex animate-pulse items-center border gap-2 px-3 py-1 rounded-full bg-gray-50 text-primary">
                  <LoaderCircleIcon
                    className="-ms-1 animate-spin"
                    size={16}
                    aria-hidden="true"
                  />
                  Carregando...
                </p>
              </div>
            ) : bookings.length === 0 ? (
              <div>
                <p className="text-primary mt-5">
                  Você não tem serviços pendentes no momento.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid ret:grid-cols-2 grid-cols-1 pot:grid-cols-1 gap-4">
                {bookings.map((booking) => (
                  <PendentCard
                    key={booking.id}
                    id={booking.id}
                    description={booking.service.description}
                    price={booking.service.price}
                    title={booking.service.title}
                    userBalance={user?.balance || 0}
                    clientId={user?.id || ""}
                    date={booking.date}
                    isOwner={user?.role === "PROVIDER"}
                    owner={booking.service.owner}
                    setBookings={setBookings}
                    setUser={setUser}
                    setServices={setServices}
                    service={booking.service}
                  />
                ))}
              </div>
            )}
          </div>
          <section className="pot:border-x pb-8 pot:order-2 order-1">
            <header className="flex flex-col items-center gap-5">
              <div
                style={{
                  backgroundImage: 'url("/images/user.jpeg")',
                }}
                className="rounded-full bg-cover size-24"
              ></div>
              <div className="text-center">
                <p className="text-3xl">{user?.name}</p>
                <p className="text-zinc-600">{user?.email}</p>
              </div>

              <div className="flex justify-center items-center mt-5 gap-5 flex-wrap">
                <div className="text-center px-4">
                  <p className="text-gray-600 uppercase text-[15px]">
                    Reservas
                  </p>
                  <p className="text-lg font-semibold font-mono">
                    {bookings.length}
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-gray-600 uppercase text-[15px]">Saldo</p>
                  <p className="text-lg font-semibold font-mono">
                    {ConvertMoneyFormat(user?.balance || 0)}
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-gray-600 uppercase text-[15px]">
                    Registrado há
                  </p>
                  <p className=" font-semibold font-mono">
                    {timeSince(user?.createdAt || "")}
                  </p>
                </div>
              </div>

              <footer className="w-full flex flex-col gap-8 px-10 mt-10">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-600">NIF</p>
                  <p className="font-mono font-semibold">
                    {user?.nif || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-600">Registrado em</p>
                  <p className="font-mono font-semibold">
                    {new Date(user?.createdAt || "").toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-600">Tipo de Conta</p>
                  <p className=" font-medium">
                    {user?.role === "PROVIDER"
                      ? "PROVIDER(Prestador de Serviços)"
                      : "CLIENT(Cliente)"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant={"outline"} className="">
                    <Bolt className="size-4" />
                    Editar Perfil
                  </Button>
                  <Button onClick={() => setOpenAddBalance(true)}>
                    Adicionar Saldo
                  </Button>
                </div>
              </footer>
            </header>
          </section>
          <div className="pot:p-8 p-1 pot:order-3 order-3">
            <header>
              <div className="flex items-center gap-4 justify-between flex-wrap">
                <h3 className="text-2xl font-semibold text-primary ">
                  Serviços Recentes
                </h3>
                <Link href={"/services"}>
                  <Button variant={"outline"}>Todos Serviços</Button>
                </Link>
              </div>
              {loadingServices ? (
                <div className="mt-5 flex items-center justify-start w-full">
                  <p className="flex animate-pulse items-center border gap-2 px-3 py-1 rounded-full bg-gray-50 text-primary">
                    <LoaderCircleIcon
                      className="-ms-1 animate-spin"
                      size={16}
                      aria-hidden="true"
                    />
                    Carregando...
                  </p>
                </div>
              ) : services.length === 0 ? (
                <div>
                  <p className="text-primary mt-5">
                    Você não tem serviços pendentes no momento.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid ret:grid-cols-2 grid-cols-1 pot:grid-cols-1 gap-4">
                  {services.slice(0, 3).map((service) => (
                    <ServiceCard
                      key={service.id}
                      title={service.title}
                      description={service.description}
                      price={service.price}
                      isOwner={
                        user?.role === "PROVIDER" && user.id === service.userId
                      }
                      userBalance={user?.balance || 0}
                      clientId={user?.id || ""}
                      logedUserId={user?.id}
                      userId={service.userId}
                      id={service.id}
                      owner={service.owner}
                      setBookings={setBookings}
                      setUser={setUser}
                      setServices={setServices}
                      service={service}
                    />
                  ))}
                </div>
              )}
            </header>
          </div>
        </section>
        <AddBalance
          open={openAddBalance}
          setOpen={setOpenAddBalance}
          setUser={setUser}
          userId={user?.id || ""}
        />
      </main>
    </div>
  );
};

export default ClientSlice;
