// NOTE: backend mirror lives in NailIt_backend/src/helpers/passwordValidator.js.
// The two repos share no code - keep them in sync.
export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_RULES = [
    { id: 'length', test: (p) => p.length >= MIN_PASSWORD_LENGTH, label: `At least ${MIN_PASSWORD_LENGTH} characters` },
    { id: 'upper',  test: (p) => /[A-Z]/.test(p),                 label: 'One uppercase letter (A-Z)' },
    { id: 'lower',  test: (p) => /[a-z]/.test(p),                 label: 'One lowercase letter (a-z)' },
    { id: 'number', test: (p) => /\d/.test(p),                    label: 'One number (0-9)' },
    { id: 'special', test: (p) => /[^A-Za-z0-9]/.test(p),         label: 'One special character (e.g. !@#$%)' },
];

// Returns the list of unmet rules (empty array = strong enough).
export const unmetPasswordRules = (password) =>
    PASSWORD_RULES.filter((rule) => !rule.test(password || ''));

export const isPasswordStrong = (password) => unmetPasswordRules(password).length === 0;