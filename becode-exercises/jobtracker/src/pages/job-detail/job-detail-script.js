const btnLogout = document.querySelector(".btn-logout");
let userLoggedIn = false;
let usernameSpan = document.getElementById("username-span");
const navLoggedIn = document.getElementById("nav-logged-in");
const navLoggedOut = document.getElementById("nav-logged-out");
const jobDetail = document.getElementById("job-detail");
const logo = document.getElementById("logo");

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("jwt");
  window.location.replace(
    "http://127.0.0.1:5500/src/pages/dashboard/dashboard.html"
  );
});

logo.addEventListener("click", () => {
  const uri = "http://127.0.0.1:5500/src/pages/dashboard/dashboard.html";
  window.location.href = uri;
});

start();

async function start() {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decodedToken = decodeToken(token);
    const tokenExpired = isTokenExpired(decodedToken.exp);
    if (!tokenExpired) {
      userLoggedIn = true;
      setupNavLoggedIn(decodedToken.firstname, decodedToken.lastname);
      loadJob(decodedToken.id, token);
    } else {
      setupNavLoggedOut();
    }
  } else {
    setupNavLoggedOut();
  }
}

async function loadJob(userId, token) {
  const job = await fetchJob(userId, token);
  populateJob(job);
}

async function fetchJob(userId, token) {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const jobId = urlParams.get("id");
    const uri = `http://localhost:3000/api/user/${userId}/joboffer/${jobId}`;
    const response = await fetch(uri, requestOptions);
    const job = await response.json();
    return job;
  } catch (err) {
    console.error(err);
  }
}

function populateJob(job) {
  populateJobIntro(job);
  populateEmployerContact(job);
  populateJobConclusion(job);
}

function populateJobIntro(job) {
  const jobIntro = document.createElement("div");
  jobIntro.setAttribute("id", "job-intro");

  const header1 = document.createElement("h1");
  header1.innerText = job.jobTitle;
  jobIntro.appendChild(header1);

  const divCompany = document.createElement("div");
  divCompany.setAttribute("id", "div-company");
  divCompany.innerText = "Company : " + job.company;
  jobIntro.appendChild(divCompany);

  const divWebsite = document.createElement("div");
  divWebsite.setAttribute("id", "div-website");
  divWebsite.innerText = "Website : " + job.website;
  jobIntro.appendChild(divWebsite);

  jobDetail.appendChild(jobIntro);
}

function populateEmployerContact(job) {
  const employerContact = document.createElement("div");
  employerContact.setAttribute("id", "employer-contact");

  const header2 = document.createElement("h2");
  header2.innerText = "Contact of the employer";
  employerContact.appendChild(header2);

  const divEmployerName = document.createElement("div");
  divEmployerName.setAttribute("id", "div-name");
  divEmployerName.innerText = "Name : " + job.contactName;
  employerContact.appendChild(divEmployerName);

  const divEmployerEmail = document.createElement("div");
  divEmployerEmail.setAttribute("id", "div-email");
  divEmployerEmail.innerText = "Email : " + job.contactEmail;
  employerContact.appendChild(divEmployerEmail);

  const divEmployerPhone = document.createElement("div");
  divEmployerPhone.setAttribute("id", "div-phone");
  divEmployerPhone.innerText = "Phone : " + job.contactPhone;
  employerContact.appendChild(divEmployerPhone);

  const divEmployerAddress = document.createElement("div");
  divEmployerAddress.setAttribute("id", "div-address");
  divEmployerAddress.innerText = "Address : " + job.contactAddress;
  employerContact.appendChild(divEmployerAddress);

  jobDetail.appendChild(employerContact);
}

function populateJobConclusion(job) {
  const jobConclusion = document.createElement("div");
  jobConclusion.setAttribute("id", "job-conclusion");

  const header2 = document.createElement("h2");
  header2.innerText = job.origin;
  jobConclusion.appendChild(header2);

  const divStatus = document.createElement("div");
  divStatus.setAttribute("id", "div-status");
  divStatus.innerText = "Status : " + job.status;
  jobConclusion.appendChild(divStatus);

  const divComment = document.createElement("div");
  divComment.setAttribute("id", "div-comment");
  divComment.innerText = "Comment : " + job.comment;
  jobConclusion.appendChild(divComment);

  jobDetail.appendChild(jobConclusion);
}

function setupNavLoggedOut() {
  userLoggedIn = false;
  usernameSpan.innerText = "Unknown";
  navLoggedOut.classList.remove("hidden");
  navLoggedIn.classList.add("hidden");
}

function setupNavLoggedIn(firstname, lastname) {
  usernameSpan.innerText = firstname + " " + lastname;
  navLoggedIn.classList.remove("hidden");
  navLoggedOut.classList.add("hidden");
}

function decodeToken(token) {
  const payload = token.split(".")[1];
  // Decode Base64Url to Base64 and then decode to string
  const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decodedPayload);
}

function isTokenExpired(expireTime) {
  const currentTime = Math.floor(Date.now() / 1000);
  return expireTime < currentTime;
}
