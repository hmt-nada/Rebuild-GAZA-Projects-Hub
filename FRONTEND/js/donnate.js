document.querySelector('.volunteer-btn').onclick = () => {
  alert("Volunteer option selected");
};

document.querySelector('.material-btn').onclick = () => {
  alert("Material donation selected");
};

document.querySelector('.money-btn').onclick = () => {
  alert("Money donation selected");
};

document.querySelector('.financing-btn').onclick = () => {
  alert("Complete project financing selected");
};

// Home does nothing
document.getElementById("homeBtn").onclick = () => {
  console.log("Home clicked (no navigation)");
};