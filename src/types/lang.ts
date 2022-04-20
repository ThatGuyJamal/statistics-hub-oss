/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
    Copyright (C) 2022, ThatGuyJamal and contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.
 */

/* eslint-disable @typescript-eslint/ban-types */

export type CustomGet<K extends string, TCustom> = K & { __type__: TCustom };

export function T<TCustom = string>(k: string): CustomGet<string, TCustom> {
  return k as CustomGet<string, TCustom>;
}

export type CustomFunctionGet<K extends string, TArgs, TReturn> = K & {
  __args__: TArgs;
  __return__: TReturn;
};

export function FT<TArgs, TReturn = string>(k: string): CustomFunctionGet<string, TArgs, TReturn> {
  return k as CustomFunctionGet<string, TArgs, TReturn>;
}

export interface Value<T = string> {
  value: T;
}

export interface Values<T = string> {
  values: readonly T[];
  count: number;
}

export interface Difference<T = string> {
  previous: T;
  next: T;
}
