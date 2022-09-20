export interface AllSettledResult<T> {
  fulfilledResults: T[];
  rejectedReasons: Error[];
}

export async function allSettledWithErrorLogging<T>(
  promises: Promise<T>[],
  errorMessageBuilder: (errors: Error[]) => string,
): Promise<AllSettledResult<T>> {
  const allSettled = await Promise.allSettled(promises);

  const fulfilledResults = allSettled
    .filter((it) => it.status === 'fulfilled')
    .map((it) => it as PromiseFulfilledResult<T>)
    .map((it) => it.value);
  const rejectedReasons = allSettled
    .filter((it) => it.status === 'rejected')
    .map((it) => it as PromiseRejectedResult)
    .map((it) => it.reason as Error);

  if (rejectedReasons.length > 0) {
    console.error(errorMessageBuilder(rejectedReasons));
  }
  return {
    fulfilledResults,
    rejectedReasons,
  };
}
