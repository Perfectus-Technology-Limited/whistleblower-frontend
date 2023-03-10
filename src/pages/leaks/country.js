import LeakPage from "@/views/LeakPage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import LeakCountryPage from "@/views/LeakCountryPage";

function country() {
  const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [country,setCountry]=useState('')

  useEffect(() => {
    if (router.isReady) {
        setIsLoading(false);
        setCountry(router.query.country);
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <LeakCountryPage country={country} />
    </div>
  );
}

export default country;
