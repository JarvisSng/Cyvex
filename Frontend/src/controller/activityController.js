import path from "../config/expressPath";

/**
 * Fire-and-forget: tell the server to bump today’s login count.
 * @throws on non-2xx or network error
 */
export async function incrementDailyLogins() {
	console.log("[CTRL] incrementDailyLogins(): POST /api/activity/login");
	const resp = await fetch(`${path}/api/activity/login`, {
		method: "POST",
		credentials: "include",
	});

	if (!resp.ok) {
		const text = await resp.text();
		console.error(
			`[CTRL] incrementDailyLogins error: status=${resp.status}, body=${text}`
		);
		throw new Error(`Activity API error: ${resp.status} — ${text}`);
	}
	console.log(
		"[CTRL] incrementDailyLogins succeeded with status",
		resp.status
	);
}
