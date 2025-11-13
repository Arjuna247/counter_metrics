let count = 0;
const countDisplay = document.getElementById("count");
const button = document.getElementById("countBtn");

button.addEventListener("click", () => {
  count++;
  countDisplay.textContent = count;

  // Send updated count to backend
  fetch("http://localhost:3000/save-count", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: count })
  })
  .then(res => res.json())
  .then(data => console.log("Server response:", data))
  .catch(err => console.error(err));
});