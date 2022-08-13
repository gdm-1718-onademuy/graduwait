import * as PasswordValidator from 'password-validator';
import * as EmailValidator from 'email-validator';

const passwordValidator = (password) => {
    var schema = new PasswordValidator()
    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);
    return schema.validate(password)
}

const emailValidator = (email) => {
    return EmailValidator.validate(email)
}

export {
    passwordValidator,
    emailValidator
};