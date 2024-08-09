const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const url = "https://job-tracker-e6y9.onrender.com/api/signup";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, firstname, lastname }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("jwt", data.token);
    window.location.replace(
      "https://philemonphilippin.github.io/becode-exercises/jobtracker/src/pages/dashboard/dashboard.html"
    );
  } else {
    console.log("Login failed!");
  }
});
