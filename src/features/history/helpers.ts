/** @format */

export const generateFakeSessions = (referenceDate: number) => {
  const refPoint = [referenceDate - 1500000, referenceDate];
  const before = refPoint.map((timestamp) => timestamp - 2500000);
  const beforeBefore = refPoint.map((timestamp) => timestamp - 5000000);
  return [beforeBefore, before, refPoint];
};

export const getFirstAndLast = (sessions: number[][]) => {
  const flatSessions = sessions.flat(1);

  return [flatSessions.at(0), flatSessions.at(-1)];
};
