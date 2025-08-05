// Create validation entities
const EmailValidator = createClass(
    "emailValidator",
    function (pattern: RegExp) {
        this.pattern = pattern;
    },
    {
        validate: function (email: string) {
            return this.pattern.test(email);
        },
        errorMessage: "Invalid email format",
    }
);

const PasswordValidator = createClass(
    "passwordValidator",
    function (minLength: number) {
        this.minLength = minLength;
    },
    {
        validate: function (password: string) {
            return (
                password.length >= this.minLength &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[0-9]/.test(password)
            );
        },
        errorMessage:
            "Password must be at least 8 characters with uppercase, lowercase, and numbers",
    }
);

const FormData = createClass(
    "formData",
    function (email: string, password: string, confirmPassword: string) {
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    },
    {
        isValid: false,
        errors: [],
    }
);

// Register validators
Ryle.register("emailValidator", EmailValidator);
Ryle.register("passwordValidator", PasswordValidator);
Ryle.register("formData", FormData);

// Create validation rules
const emailRule = Ryle("Validate [formData] email with [emailValidator]");
const passwordRule = Ryle(
    "Validate [formData] password with [passwordValidator]"
);
const confirmRule = Ryle("Confirm [formData] password match");

// Usage
const emailValidator = new EmailValidator(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const passwordValidator = new PasswordValidator(8);

const userData = new FormData(
    "user@example.com",
    "SecurePass123",
    "SecurePass123"
);

const emailValidationHandler = emailRule.handler((formData, validator) => {
    if (!validator.validate(formData.email)) {
        formData.errors.push(validator.errorMessage);
        return false;
    }
    return true;
});

const results = [emailValidationHandler([userData, emailValidator])];
userData.isValid = results.every((result) => result);
