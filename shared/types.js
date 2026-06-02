// Shared runtime helpers for device shapes (no TypeScript types)
function createDevicePayload(data) {
  return {
    name: data.name || '',
    macAddress: data.macAddress || '',
    ipAddress: data.ipAddress || '',
    port: Number(data.port) || 0,
    notes: data.notes || '',
    status: data.status || 'disconnected'
  };
}

module.exports = { createDevicePayload };
