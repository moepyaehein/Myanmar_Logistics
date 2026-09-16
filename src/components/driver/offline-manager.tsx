"use client";

import { useState, useEffect, useCallback } from "react";
import { getQueue, clearSynced, removeFromQueue, type QueueEntry } from "@/lib/offline/queue";
import { syncQueue, type SyncResult } from "@/lib/offline/sync";
import { SHIPMENT_STATUS_LABELS } from "@/types/domain";

type Props = { userId: string };

export function OfflineManager({ userId }: Props) {
  const [simulated, setSimulated] = useState(false);
  const [online, setOnline] = useState(true);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  const effectivelyOffline = simulated || !online;

  // Keep real online state in sync
  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  // Refresh queue state when it may have changed
  const refreshQueue = useCallback(() => {
    setQueue(getQueue(userId));
  }, [userId]);

  useEffect(() => {
    refreshQueue();
    // Listen for custom events dispatched when the update form adds to the queue
    const handler = () => refreshQueue();
    window.addEventListener("offline-queue-updated", handler);
    return () => window.removeEventListener("offline-queue-updated", handler);
  }, [refreshQueue]);

  // Expose simulated offline state for the update form to check
  useEffect(() => {
    (window as unknown as Record<string, boolean>).__simulatedOffline = simulated;
    return () => { delete (window as unknown as Record<string, boolean>).__simulatedOffline; };
  }, [simulated]);

  async function handleSync() {
    if (syncing || effectivelyOffline) return;
    setSyncing(true);
    setLastResult(null);
    try {
      const result = await syncQueue(userId, () => refreshQueue());
      setLastResult(result);
    } finally {
      setSyncing(false);
      refreshQueue();
    }
  }

  function handleClearSynced() {
    clearSynced(userId);
    refreshQueue();
  }

  function handleDismissError(entryId: string) {
    removeFromQueue(userId, entryId);
    refreshQueue();
  }

  const pending = queue.filter((e) => e.syncStatus === "pending");
  const synced = queue.filter((e) => e.syncStatus === "synced");
  const errors = queue.filter((e) => e.syncStatus === "error");

  if (queue.length === 0 && !simulated) return null;

  return <section className="panel offline-manager">
    <div className="panel-heading">
      <div>
        <h2>Offline queue</h2>
        <p className="panel-subtitle">
          {effectivelyOffline
            ? "You are offline. Updates are saved locally."
            : pending.length > 0
              ? `${pending.length} pending update${pending.length === 1 ? "" : "s"} ready to sync.`
              : queue.length > 0
                ? "All updates synced."
                : "Simulated offline mode is available for demo."}
        </p>
      </div>
      <div className="offline-controls">
        <button
          type="button"
          className={`button ${simulated ? "button-dark" : "signout-button"}`}
          onClick={() => setSimulated(!simulated)}
        >
          {simulated ? "Go online" : "Simulate offline"}
        </button>
      </div>
    </div>

    {/* Sync button */}
    {pending.length > 0 && !effectivelyOffline && (
      <div className="offline-sync-bar">
        <button
          type="button"
          className="button button-dark"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? "Syncing…" : `Sync ${pending.length} update${pending.length === 1 ? "" : "s"}`}
        </button>
        {lastResult && (
          <p className="sync-result" role="status">
            {lastResult.synced > 0 && `${lastResult.synced} synced. `}
            {lastResult.failed > 0 && `${lastResult.failed} need review. `}
            {lastResult.pending > 0 && `${lastResult.pending} still pending. `}
          </p>
        )}
      </div>
    )}

    {/* Queue items */}
    {queue.length > 0 && (
      <ul className="offline-queue-list">
        {queue.map((entry) => (
          <li key={entry.id} className={`queue-item queue-${entry.syncStatus}`}>
            <div className="queue-item-head">
              <span className={`queue-badge queue-badge-${entry.syncStatus}`}>
                {entry.syncStatus === "pending" ? "Pending Sync" : entry.syncStatus === "synced" ? "Synced" : "Needs Review"}
              </span>
              <span className="queue-shipment">{entry.shipmentNumber}</span>
            </div>
            <div className="queue-item-body">
              <strong>{SHIPMENT_STATUS_LABELS[entry.status]}</strong>
              {entry.note && <p>{entry.note}</p>}
              {entry.latitude !== null && entry.longitude !== null && (
                <small>GPS: {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}</small>
              )}
              <time dateTime={entry.queuedAt}>
                Queued {new Date(entry.queuedAt).toLocaleString("en-GB", { timeZone: "Asia/Yangon", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </time>
            </div>
            {entry.syncStatus === "error" && entry.errorMessage && (
              <div className="queue-error">
                <p role="alert">{entry.errorMessage}</p>
                <button type="button" className="button signout-button" onClick={() => handleDismissError(entry.id)}>
                  Dismiss
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}

    {/* Clear synced */}
    {synced.length > 0 && (
      <div className="offline-sync-bar">
        <button type="button" className="button signout-button" onClick={handleClearSynced}>
          Clear {synced.length} synced {synced.length === 1 ? "entry" : "entries"}
        </button>
      </div>
    )}

    {/* Error summary */}
    {errors.length > 0 && (
      <p className="queue-error-summary" role="status">
        {errors.length} update{errors.length === 1 ? "" : "s"} could not be synced. Review and dismiss to continue.
      </p>
    )}
  </section>;
}
