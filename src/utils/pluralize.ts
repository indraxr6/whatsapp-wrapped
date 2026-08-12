export function formatParticipantPhrase(count: number, duoPhrase: string, pluralPhrase: string): string {
  if (count <= 2) {
    return duoPhrase;
  }
  return pluralPhrase;
}
