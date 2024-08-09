const btnLogout = document.querySelector(".btn-logout");
let userLoggedIn = false;
let usernameSpan = document.getElementById("username-span");
const navLoggedIn = document.getElementById("nav-logged-in");
const navLoggedOut = document.getElementById("nav-logged-out");
const jobsGrid = document.getElementById("jobs-grid");
const askToLogin = document.getElementById("ask-to-login");
const logo = document.getElementById("logo");
const btnOpenAddJob = document.getElementById("btn-open-add-job");
const addJobFormContainer = document.getElementById("add-job-form-container");
const btnCancelCreate = document.getElementById("btn-cancel-create");
const addJobContainer = document.getElementById("add-job-container");

btnCancelCreate.addEventListener("click", closeAddJob);
btnOpenAddJob.addEventListener("click", openAddJob);

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("jwt");
  window.location.reload();
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
      dontAskToLogin();
      displayAddJobContainer();
      await loadJobs(decodedToken.id, token);
    } else {
      setupNavLoggedOut();
      setUpAskToLogin();
      hideAddJobContainer();
    }
  } else {
    setupNavLoggedOut();
    setUpAskToLogin();
    hideAddJobContainer();
  }
}

async function loadJobs(userId, token) {
  const jobs = await fetchJobs(userId, token);
  populateJobsGrid(jobs);
}

function populateJobsGrid(jobs) {
  for (const job of jobs) {
    const jobCard = document.createElement("div");
    jobCard.classList.add("card-container");
    jobCard.setAttribute("id", job._id);

    const jobTitle = document.createElement("h3");
    jobTitle.innerText = job.jobTitle;
    jobCard.appendChild(jobTitle);

    const jobCompany = document.createElement("p");
    jobCompany.innerText = job.company;
    jobCard.appendChild(jobCompany);

    const jobStatus = document.createElement("p");
    jobStatus.innerText = job.status;
    jobCard.appendChild(jobStatus);

    jobCard.addEventListener("click", (e) => {
      openJobDetails(e, job);
    });

    jobsGrid.appendChild(jobCard);
  }
}

function openAddJob() {
  addJobFormContainer.classList.remove("hidden");
}

function closeAddJob() {
  addJobFormContainer.classList.add("hidden");
}

function openJobDetails(e, job) {
  const uri = `http://127.0.0.1:5500/src/pages/job-detail/job-detail.html?id=${job._id}`;
  window.location.href = uri;
}

function createListItem(propertyName, value) {
  const listItem = document.createElement("li");
  listItem.innerText = `${propertyName} : ${value}`;
  return listItem;
}

async function fetchJobs(userId, token) {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const uri = `http://localhost:3000/api/user/${userId}/joboffer`;
    const response = await fetch(uri, requestOptions);
    const jobs = await response.json();
    return jobs;
  } catch (err) {
    console.error(err);
  }
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

function setUpAskToLogin() {
  askToLogin.classList.remove("hidden");
}

function dontAskToLogin() {
  askToLogin.classList.add("hidden");
}

function hideAddJobContainer() {
  addJobContainer.classList.add("hidden");
}

function displayAddJobContainer() {
  addJobContainer.classList.remove("hidden");
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

document
  .getElementById("jobForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      jobTitle: document.getElementById("jobTitle").value,
      company: document.getElementById("company").value,
      website: document.getElementById("website").value,
      contactName: document.getElementById("contactName").value,
      contactEmail: document.getElementById("contactEmail").value,
      contactPhone: document.getElementById("contactPhone").value,
      contactAddress: document.getElementById("contactAddress").value,
      origin: document.getElementById("origin").value,
      status: document.getElementById("status").value,
      comment: document.getElementById("comment").value,
    };

    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        const decodedToken = decodeToken(token);
        const tokenExpired = isTokenExpired(decodedToken.exp);
        if (!tokenExpired) {
          const uri = `http://localhost:3000/api/user/${decodedToken.id}/joboffer`;
          const response = await fetch(uri, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            console.error(`An error occurred: ${response.statusText}`);
          }

          // Optionally, handle the response (e.g., display a success message or redirect)
          const result = await response.json();
          console.log("Job created successfully:", result);
          window.location.reload();
        } else {
          setupNavLoggedOut();
          setUpAskToLogin();
          hideAddJobContainer();
        }
      } else {
        setupNavLoggedOut();
        setUpAskToLogin();
        hideAddJobContainer();
      }
      // Optionally, redirect to another page
      // window.location.href = `job-details.html?jobId=${result._id}`;
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error creating the job. Please try again.");
    }
  });
