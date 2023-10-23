export const formatTimeElapsed = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const secString = `${seconds < 10 ? "0" + seconds : seconds}`;
  const minString = `${minutes < 10 ? "0" + minutes : minutes}`;
  const hrString = `${hours < 10 ? "0" + hours : hours}`;

  if (hours >= 1) {
    return `${hrString}:${minString}:${secString}`;
  } else {
    return `${minString}:${secString}`;
  }
};
