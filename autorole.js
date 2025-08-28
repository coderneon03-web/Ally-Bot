export function register(client) {
  const autoRoleId = process.env.AUTOROLE_ID;

  client.on('guildMemberAdd', (member) => {
    if (autoRoleId) {
      member.roles.add(autoRoleId).catch(()=>{});
    }
  });
}
