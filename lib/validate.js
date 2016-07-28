export function emailIsValid(email) {
  const EMAIL_REGEX = /^(?=.{1,255}$)([^@\s\.]+\.)*[^@\s\.]+@[^@\s\.]+(\.[^@\s\.]+)+$/;
  return EMAIL_REGEX.test(email);
};

export default {
  emailIsValid
};
