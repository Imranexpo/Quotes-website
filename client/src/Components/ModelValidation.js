function modelValidation(values) {
    let error = {}; 
    const firstNameRegex = /^[A-Z][a-z]*(\s[a-z]+)*$/;
    const lastNameRegex =  /^[A-Z][a-z]*(\s[a-z]+)*$/;
    const titleNameRegex = /^[A-Z][a-z]*(\s[a-z]+)*$/;;
    if (values.firstName === "") {
      error.firstName = "First Name should not be empty";
    } else if (!firstNameRegex.test(values.firstName)) {
      error.firstName = "First Name didn't match";
    } 
    if (values.lastName === "") {
      error.lastName =  "Last Name should not be empty";
    } else if (!lastNameRegex.test(values.lastName)) {
      error.lastName = "Last Name didn't match"
    } 
    if (values.titleName === "") {
      error.titleName = "Title Name should not be empty";
    } else if (!titleNameRegex.test(values.titleName)) {
      error.titleName = "Title Name didn't match"
    } 
    if (values.textBox === "") {
      error.textBox = "Quote should not be empty";
    }
    return error;
  }
  export default modelValidation;
  