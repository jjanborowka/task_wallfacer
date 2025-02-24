

  

export function getRandomDate(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = Math.random() * (endTime - startTime) + startTime;
    return new Date(randomTime);
  }