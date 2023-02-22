import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import HomePage from "@/views/HomePage";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  return <HomePage />;
}
