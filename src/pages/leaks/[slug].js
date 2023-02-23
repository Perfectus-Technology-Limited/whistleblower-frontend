import FileList from "@/components/FileList";
import Loader from "@/components/Loader";
import IconArrowDownSquareFill from "@/utils/IconArrowDownSquareFill";
import IconArrowUpSquareFill from "@/utils/IconArrowUpSquareFill";
import IconBxUserCircle from "@/utils/IconBxUserCircle";
import { useRouter } from "next/router";
import LeakDetailsPage from "@/views/LeakDetailsPage";

export default function Details() {
  const router = useRouter();
  const { slug } = router?.query

  return (
    <div className="container">
      <LeakDetailsPage ipfsCID={slug} />
    </div>
  );
}
