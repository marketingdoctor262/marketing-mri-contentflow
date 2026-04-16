export function renderChannelBlock(channels = []) {
  if (!channels.length) return "";
  return `<section class="card">
    <h4>SNS 채널</h4>
    ${channels.map((channel) => `<p>${channel.pl} - ${channel.st}${channel.n ? ` (${channel.n})` : ""}</p>`).join("")}
  </section>`;
}
