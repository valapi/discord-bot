import type { ILanguage, ILanguageName } from "./interface";
declare const _defaultLanguage: ILanguageName;
declare function getLanguage(language?: string): ILanguage | void;
declare function getLanguageAndUndefined(language?: string): ILanguage;
export { getLanguage, getLanguageAndUndefined, _defaultLanguage as defaultLanguage, };
