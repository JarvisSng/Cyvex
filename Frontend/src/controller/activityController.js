/**
 * Fire-and-forget: tell the server to bump today’s login count.
 * @throws on non-2xx or network error
 */
export async function incrementDailyLogins() {
	const resp = await fetch("/api/activity/loginCount", {
		method: "POST",
		credentials: "include",
	});

	if (!resp.ok) {
		// Optionally read error text:
		const text = await resp.text();
		throw new Error(`Activity API error: ${resp.status} — ${text}`);
	}

	// No JSON to parse—just succeed or throw
}
