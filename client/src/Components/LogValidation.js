
function logValidation(value) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    if(value.email === "") {
        error.email = "Name should not be empty"
    }
    else if (!email_pattern.test(value.email)) {
        error.email = "Email Didn't match"
    } else {
        error.email = ""
    }
    if (value.password === "") {
        error.password = "password should not be empty"
    }
    else if (!password_pattern.test(value.password)) {
        error.password = "Password Didn't match"
    } else {
        error.password = ""
    }
    return error;
}
export default logValidation;