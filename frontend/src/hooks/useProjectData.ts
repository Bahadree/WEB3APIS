"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export interface Project {
  id: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  gameType?: string;
  imageUrl?: string; // Oyun resmi url'si
  // diğer alanlar gerekiyorsa eklenebilir
}

export function useProjectData() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refreshProject = () => setRefreshIndex((i) => i + 1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    axios.get(`/api/dev/projects/${id}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    )
      .then((r) => {
        const d = r.data;
        setProject({
          id: d.data.project.id,
          name: d.data.project.name,
          description: d.data.project.description,
          websiteUrl: d.data.project.website_url,
          gameType: d.data.project.game_type,
          imageUrl: d.data.project.image_url,
        });
      })
      .catch(() => setError("Error"))
      .finally(() => setLoading(false));
  }, [id, refreshIndex]);

  return { project, loading, error, refreshProject };
}
