export const setupStdin = (callback?: () => void) => {
  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
  }

  process.stdin.resume();

  const exitKeys = {
    enter: 13,
    esc: 27,
    q: 113,
  };

  process.stdin.on('data', (data) => {
    const key = data.toString().trim().toLowerCase().charCodeAt(0);

    if (key === 3) {
      process.exit(0);
    }

    if ([...Object.values(exitKeys)].includes(key)) {
      callback?.();

      process.exit();
    }
  });
};
