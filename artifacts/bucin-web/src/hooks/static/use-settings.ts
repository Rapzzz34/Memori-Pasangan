import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";

function mapRow(row: Record<string, unknown>): SiteSettings {
  return {
    id: row.id as number,
    person1Name: (row.person1_name as string) ?? "",
    person2Name: (row.person2_name as string) ?? "",
    loveDate: (row.love_date as string | null) ?? null,
    loveMessage: (row.love_message as string) ?? "",
    coverImageUrl: (row.cover_image_url as string | null) ?? null,
    person1Birthday: (row.person1_birthday as string | null) ?? null,
    person2Birthday: (row.person2_birthday as string | null) ?? null,
    updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (mounted && data) setSettings(mapRow(data));
      if (mounted) setIsLoading(false);
    };
    load();

    const channel = supabase
      .channel("site_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, (payload) => {
        if (mounted && payload.new) setSettings(mapRow(payload.new as Record<string, unknown>));
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSettings = useCallback(async ({ data }: {
    data: {
      person1Name?: string;
      person2Name?: string;
      loveDate?: string | null;
      loveMessage?: string;
      person1Birthday?: string | null;
      person2Birthday?: string | null;
      coverImageUrl?: string | null;
      person1Password?: string;
      person2Password?: string;
    };
  }) => {
    setIsUpdating(true);
    try {
      const { person1Password: _p1, person2Password: _p2, ...rest } = data;
      const payload: Record<string, unknown> = {
        person1_name: rest.person1Name,
        person2_name: rest.person2Name,
        love_date: rest.loveDate ?? null,
        love_message: rest.loveMessage,
        person1_birthday: rest.person1Birthday ?? null,
        person2_birthday: rest.person2Birthday ?? null,
        cover_image_url: rest.coverImageUrl ?? null,
        updated_at: new Date().toISOString(),
      };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      await supabase.from("site_settings").upsert({ id: 1, ...payload });
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { settings, isLoading, updateSettings, isUpdating };
}
