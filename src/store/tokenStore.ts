export const invalidatedTokens = new Set<string>();

export const invalidateToken = (token: string) => {
  invalidatedTokens.add(token);
};

export const isTokenInvalid = (token: string) => {
  return invalidatedTokens.has(token);
};
