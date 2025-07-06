"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjectData } from "@/hooks/useProjectData";
import Navbar from "@/components/layout/navbar";

export default function ProjectDetailPage() {
  const { project, loading, error } = useProjectData();
  const router = useRouter();

  useEffect(() => {
    // Eğer proje varsa otomatik dashboard'a yönlendir
    if (project && project.id) {
      router.replace(`/dev/project/${project.id}/dashboard`);
    }
  }, [project, router]);

  return null; // Yönlendirme yapılacak, içerik gösterilmeyecek
}
