export function isWebRTCSupported() {
  return window.RTCPeerConnection !== undefined;
}
