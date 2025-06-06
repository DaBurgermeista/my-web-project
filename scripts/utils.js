export function logGreeting(name) {
  console.log(`Welcome to ${name}!`);
}

export function log(message, type = "system") {
  const logBox = document.getElementById("log");
  if (!logBox) return;

  const entry = document.createElement("p");
  entry.classList.add(`log-${type}`);
  entry.innerHTML = message;

  logBox.appendChild(entry);

  // Trim excess entries
  const maxLines = 50;
  while (logBox.children.length > maxLines) {
    logBox.removeChild(logBox.firstChild);
  }

  // Force scroll AFTER layout
  requestAnimationFrame(() => {
    logBox.scrollTop = logBox.scrollHeight;
    console.log(`Scrolled to: ${logBox.scrollTop} of ${logBox.scrollHeight}`);
  });
}



