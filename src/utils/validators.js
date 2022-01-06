/**
 * Utility function to validate email, or validate username to be proper email.
 * @param {string} email - The email to be validated.
 * @return {boolean} Whether the email is valid.
 */
export const validateEmail = (email) => {
  const emailValidationRegex =
        // eslint-disable-next-line max-len
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailValidationRegex.test(String(email || '').toLowerCase());
};

/**
 * Utility function to validate password.
 * @param {string} password - The password to be validated.
 * @return {boolean} Whether the password is valid.
 */
export const validatePassword = (password) => password && password.length >= 5;

