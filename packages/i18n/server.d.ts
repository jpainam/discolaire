import type { i18n, TFunction } from "i18next";
import "server-only";
export declare function detectLanguage(): Promise<string>;
export declare const getServerTranslations: (ns?: any, options?: {
    keyPrefix?: string;
}) => Promise<{
    t: TFunction<string, unknown>;
    i18n: i18n;
}>;
//# sourceMappingURL=server.d.ts.map