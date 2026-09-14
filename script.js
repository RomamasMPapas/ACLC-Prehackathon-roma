const form = document.querySelector("#login-form, #register-form");
const statusMessage = document.querySelector("#form-status");
const submitLabel = document.querySelector("#submit-label");
const demoAccounts = [
  { email: "robmalik191@gmail.com", password: "R0bmalik_n1", role: "admin" },
  { email: "robmalik19@gmail.com", password: "R0bm4l1k1_n1", role: "user" }
];

document.querySelectorAll(".password-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const passwordInput = toggle.parentElement.querySelector("input");
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Hide" : "Show";
    toggle.setAttribute("aria-label", `${isHidden ? "Hide" : "Show"} password`);
  });
});

const captcha = document.querySelector("#captcha");
if (captcha) {
  captcha.addEventListener("click", () => {
    captcha.setAttribute("aria-pressed", "true");
    captcha.querySelector("#captcha-status").textContent = "Verified";
    captcha.querySelector(".captcha-check").classList.add("verified");
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    form.querySelectorAll(".error-message").forEach((error) => { error.textContent = ""; });
    form.querySelectorAll(".is-invalid").forEach((input) => { input.classList.remove("is-invalid"); });
    statusMessage.textContent = "";

    form.querySelectorAll("input[required]").forEach((input) => {
      if (!input.validity.valid) {
        const error = document.querySelector(`#${input.id}-error`);
        if (error) error.textContent = input.value ? "Please check this field." : "This field is required.";
        input.classList.add("is-invalid");
        isValid = false;
      }
    });

    const confirmPassword = document.querySelector("#confirm-password");
    if (confirmPassword && confirmPassword.value !== document.querySelector("#password").value) {
      document.querySelector("#confirm-password-error").textContent = "Passwords do not match.";
      confirmPassword.classList.add("is-invalid");
      isValid = false;
    }

    if (captcha && captcha.getAttribute("aria-pressed") !== "true") {
      document.querySelector("#captcha-error").textContent = "Please verify that you are not a robot.";
      isValid = false;
    }

    if (!isValid) return;

    if (form.id === "login-form") {
      const email = document.querySelector("#email").value.trim().toLowerCase();
      const password = document.querySelector("#password").value;
      const account = demoAccounts.find((demoAccount) => demoAccount.email === email && demoAccount.password === password);

      if (!account) {
        statusMessage.textContent = "Incorrect email or password.";
        statusMessage.classList.add("login-error");
        return;
      }

      statusMessage.classList.remove("login-error");
      submitLabel.textContent = "Signing in...";
      statusMessage.textContent = "Checking your details...";

      window.setTimeout(() => {
        sessionStorage.setItem("northstarRole", account.role);
        window.location.href = "home.html";
      }, 700);
      return;
    }

    submitLabel.textContent = form.id === "register-form" ? "Creating account..." : "Signing in...";
    statusMessage.textContent = "Checking your details...";

    window.setTimeout(() => {
      submitLabel.textContent = form.id === "register-form" ? "Create account" : "Sign in";
      statusMessage.textContent = form.id === "register-form" ? "Demo account created. Welcome to Northstar." : "Demo sign-in complete. Welcome back.";
    }, 700);
  });
}