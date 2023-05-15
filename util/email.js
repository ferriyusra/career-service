function checkEmail(email) {
  console.log(email)
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  return !!email.match(regexEmail);
}

module.exports = {
  checkEmail,
};
