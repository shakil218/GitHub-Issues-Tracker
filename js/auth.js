const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // prevents the page from reloading

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    // Redirect to dashboard
    window.location.replace("dashboard.html");
  } else {
    // show error
    alert("Invalid login credentials");
  }
});
