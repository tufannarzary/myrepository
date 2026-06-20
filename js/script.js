const statusButton = document.getElementById("statusButton");
const statusMessage = document.getElementById("statusMessage");

statusButton.addEventListener("click", function () {
  statusMessage.textContent =
    "Project files are ready for GitHub Actions CI validation.";
});
