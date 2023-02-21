import Loader from "@/components/Loader";
import LeakPage from "@/views/LeakPage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Leaks() {

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

  return (
    <div className="container">
      <LeakPage />
    </div>
  );
}

export default Leaks;
