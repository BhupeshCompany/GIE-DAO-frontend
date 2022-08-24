/**Pattern for private key */
export const privateKeyRegix = /^$|^[a-zA-Z0-9]+$/;

/**Patter for password */
export const passwordRegex =
  /^.*(?=.{3,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

/** Patter for swaping values */
export const TokenValueRegix = /^$|^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;