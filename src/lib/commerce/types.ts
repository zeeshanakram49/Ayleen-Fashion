export type UnknownRecord = Record<string, unknown>;

export type CommerceResult<T> = {
  data: T;
  source: "api" | "fallback";
  message?: string;
};

export type UpstreamResponse = {
  ok: boolean;
  status: number;
  data: unknown;
};
