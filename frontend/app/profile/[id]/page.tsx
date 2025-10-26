"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ClientSlice from "../Types/Client";
import ProviderSlice from "../Types/Provider";
import axios from "axios";
import { toast } from "sonner";
import LoadingComponent from "@/components/Partials/LoadingComponent";
import { getCookie, setCookie } from "cookies-next";
import { decodeToken } from "@/components/Partials/decodeToken";

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
  const [type, setType] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const decoded = decodeToken(getCookie("bulir_token") as string);

    if (!decoded) {
      router.push("/login");
      setCookie("session_expired", "true");
    }
  }, [router]);

  useEffect(() => {
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
            if (error.response.status === 401) {
              setCookie("session_expired", "true");
              window.location.href = "/login";
              return;
            }

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
    <ClientSlice user={user} setUser={setUser} />
  ) : (
    <ProviderSlice user={user} />
  );
}
