import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function AdminRoute() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);

  const authCheck = useCallback(async () => {
    try {
      const res = await fetch("/api/user/admin-auth", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
         credentials: "include",
      });

      const data = await res.json();

      if (data?.check) {
        setOk(true);
      } else {
        setOk(false);
      }
    } catch (error) {
      console.log(error);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      authCheck();
    } else {
      setLoading(false);
    }
  }, [currentUser, authCheck]);

  if (loading) {
    return <Spinner />;
  }

  return ok ? <Outlet /> : <Navigate to="/login" />;
}