/** @format */

export default async function getSessions() {
  return fetch("/api/sessions.json");
}
