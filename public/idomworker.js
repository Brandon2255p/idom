(() => {
  // src/idomworker.js
  console.log("Worker started.");
  postMessage("Worker started.");
})();
