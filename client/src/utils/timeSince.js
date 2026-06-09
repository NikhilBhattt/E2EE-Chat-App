function timeSinceIST(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "IST",
  });
}

export default timeSinceIST;
