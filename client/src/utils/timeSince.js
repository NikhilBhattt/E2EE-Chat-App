function timeSinceUTC(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  });
}

export default timeSinceUTC;
