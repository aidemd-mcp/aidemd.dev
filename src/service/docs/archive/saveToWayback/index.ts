/**
 * saveToWayback
 *
 * POSTs to the Wayback Machine Save Page Now API and polls for completion.
 * Retries up to 3 times with exponential backoff (1s → 4s → 16s).
 * Throws on the 4th failure — callers must not swallow the error.
 *
 * Auth is read from WAYBACK_ACCESS_KEY and WAYBACK_SECRET_KEY env vars.
 * Neither value is logged or committed.
 *
 * @param versionedUrl - The fully-qualified live URL to archive
 * @returns The Wayback Machine archive URL for the submitted page
 */
export default async function saveToWayback(
  versionedUrl: string
): Promise<string> {
  const accessKey = process.env.WAYBACK_ACCESS_KEY;
  const secretKey = process.env.WAYBACK_SECRET_KEY;

  const maxAttempts = 4; // 1 initial + 3 retries
  const backoffDelaysMs = [1_000, 4_000, 16_000];

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      const delayMs = backoffDelaysMs[attempt - 1];
      await sleep(delayMs);
    }

    try {
      const waybackUrl = await attemptSave(versionedUrl, accessKey, secretKey);
      return waybackUrl;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw new Error(
    `Wayback save failed for ${versionedUrl} after 3 retries; publish blocked. Last error: ${lastError?.message ?? "unknown"}`
  );
}

async function attemptSave(
  versionedUrl: string,
  accessKey: string | undefined,
  secretKey: string | undefined
): Promise<string> {
  const saveEndpoint = "https://web.archive.org/save";

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  if (accessKey && secretKey) {
    headers["Authorization"] = `LOW ${accessKey}:${secretKey}`;
  }

  const body = new URLSearchParams({
    url: versionedUrl,
    capture_all: "1",
  });

  const saveResponse = await fetch(saveEndpoint, {
    method: "POST",
    headers,
    body: body.toString(),
  });

  if (!saveResponse.ok) {
    throw new Error(
      `Wayback save request failed: HTTP ${saveResponse.status} ${saveResponse.statusText}`
    );
  }

  const saveData = (await saveResponse.json()) as Record<string, unknown>;

  console.log(`  [saveToWayback] response: ${JSON.stringify(saveData)}`);

  // SPN2 returns a job_id for async jobs; fall through to polling
  const jobId =
    typeof saveData["job_id"] === "string" ? saveData["job_id"] : null;

  if (jobId) {
    return pollForCompletion(jobId, accessKey, secretKey);
  }

  // Synchronous response: Wayback returns the snapshot URL directly
  const snapshotUrl = extractSnapshotUrl(saveData, versionedUrl);
  if (snapshotUrl) {
    return snapshotUrl;
  }

  throw new Error(
    `Wayback save response did not contain a job_id or snapshot URL: ${JSON.stringify(saveData)}`
  );
}

async function pollForCompletion(
  jobId: string,
  accessKey: string | undefined,
  secretKey: string | undefined
): Promise<string> {
  const statusEndpoint = `https://web.archive.org/save/status/${jobId}`;
  const maxPollAttempts = 30;
  const pollIntervalMs = 5_000;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (accessKey && secretKey) {
    headers["Authorization"] = `LOW ${accessKey}:${secretKey}`;
  }

  for (let poll = 0; poll < maxPollAttempts; poll++) {
    if (poll > 0) {
      await sleep(pollIntervalMs);
    }

    let statusData: Record<string, unknown>;
    try {
      const statusResponse = await fetch(statusEndpoint, { headers });
      if (!statusResponse.ok) {
        // Transient HTTP error — retry on next poll
        continue;
      }
      statusData = (await statusResponse.json()) as Record<string, unknown>;
    } catch {
      // Network error (fetch failed, timeout, etc.) — retry on next poll
      continue;
    }

    const status = statusData["status"];

    if (status === "success") {
      const timestamp = statusData["timestamp"];
      const originalUrl = statusData["original_url"];
      if (typeof timestamp === "string" && typeof originalUrl === "string") {
        return `https://web.archive.org/web/${timestamp}/${originalUrl}`;
      }
      throw new Error(
        `Wayback job succeeded but response is missing timestamp or original_url: ${JSON.stringify(statusData)}`
      );
    }

    if (status === "error") {
      const reason =
        typeof statusData["exception"] === "string"
          ? statusData["exception"]
          : JSON.stringify(statusData);
      throw new Error(`Wayback save job failed: ${reason}`);
    }

    // status === "pending" — keep polling
  }

  throw new Error(
    `Wayback save job ${jobId} did not complete within ${maxPollAttempts} polls`
  );
}

function extractSnapshotUrl(
  data: Record<string, unknown>,
  originalUrl: string
): string | null {
  // Some synchronous SPN responses include a "url" field with the full archive URL
  if (typeof data["url"] === "string") {
    return data["url"];
  }

  // Fallback: reconstruct from timestamp if present in the response headers pattern
  const timestamp = data["timestamp"];
  if (typeof timestamp === "string") {
    return `https://web.archive.org/web/${timestamp}/${originalUrl}`;
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
