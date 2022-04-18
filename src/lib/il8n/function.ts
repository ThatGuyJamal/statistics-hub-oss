import { InternationalizationContext, InternationalizationOptions, TOptions } from "@sapphire/plugin-i18next";
import { container } from "@sapphire/framework";

export function parseInternationalizationOptions(): InternationalizationOptions {
  return {
    defaultName: "en-US",
    defaultMissingKey: "default:key_error",
    fetchLanguage: async (context: InternationalizationContext) => {
      if (!context.guild) return "en-US";
      else {
        let langFetch = await container.client.GuildSettingsModel.getDocument(context.guild);
        if (langFetch) {
          return langFetch.language ?? "en-US";
        } else {
          return "en-US";
        }
      }
    },
    i18next: (_: string[], languages: string[]) => ({
      supportedLngs: languages,
      preload: languages,
      returnObjects: true,
      returnEmptyString: false,
      returnNull: false,
      load: "all",
      lng: "en-US",
      fallbackLng: "en-US",
      defaultNS: "globals",
      overloadTranslationOptionHandler: (args: any[]): TOptions => ({
        defaultValue: args[1] ?? "globals:default",
      }),
      initImmediate: false,
    }),
  };
}
