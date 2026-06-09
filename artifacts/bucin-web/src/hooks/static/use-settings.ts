import { SETTINGS } from "@/data/content";

export function useSettings() {
  return {
    settings: {
      id: 1,
      person1Name: SETTINGS.person1Name,
      person2Name: SETTINGS.person2Name,
      loveDate: SETTINGS.loveDate,
      loveMessage: SETTINGS.loveMessage,
      person1Birthday: SETTINGS.person1Birthday,
      person2Birthday: SETTINGS.person2Birthday,
      coverImageUrl: SETTINGS.coverImageUrl,
      updatedAt: new Date().toISOString(),
    },
    isLoading: false,
    updateSettings: () => {},
    isUpdating: false,
  };
}
