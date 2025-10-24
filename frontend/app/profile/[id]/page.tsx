"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ClientSlice from "../Types/Client";
import ProviderSlice from "../Types/Provider";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "sonner";
import LoadingComponent from "@/components/Partials/LoadingComponent";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  nif: string;
  password: string;
  role: "PROVIDER" | "CLIENT";
  createdAt: string;
  updatedAt: string;
  balance?: number;
}

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [type, setType] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    // const token = getCookie("bulir_token") as string;
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/profile/${id}`);
        setUser(response.data);
        setType(response.data.role);
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
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingComponent />;

  return type?.toLowerCase() === "client" ? (
    <ClientSlice />
  ) : (
    <ProviderSlice user={user} />
  );
}
