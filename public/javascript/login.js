document.getElementById('register').addEventListener('click', () => {
  document.getElementById('registrationDiv').style.display = "block";
  document.getElementById('loginDiv').style.display = "none";
});
document.getElementById('login').addEventListener('click', () => {
  document.getElementById('registrationDiv').style.display = "none";
  document.getElementById('loginDiv').style.display = "block";
});
