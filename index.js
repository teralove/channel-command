// OPCODE REQUIRED :
// - C_SELECT_CHANNEL
// - S_CURRENT_CHANNEL

// Version 1.32 r:00

module.exports = function ChannelCommand(d) {

	let currentChannel = 0

	// code
	d.hook('S_CURRENT_CHANNEL', (e) => { currentChannel = e })

	// helper
	function changeChannel(newChannel) {
		// If the current channel is absurdly high, then it's probably an instance id and the the player is in an instance.
		// Changing channels inside an instance will teleport the player out to the entrance/teleportal of the instance.
		if (currentChannel.channel > 20) return
		// decrement by 1, because C_SELECT_CHANNEL identifies channel 1 as 0
		newChannel -= 1

		d.toServer('C_SELECT_CHANNEL', {
			unk: 1,
			zone: currentChannel.zone,
			channel: newChannel
		})
	}

	// command
	try {
		const Command = require('command')
		const command = Command(d)
		command.add(['channel', 'ch', 'c', 'ㅊ'], (num) => {
			if (isNaN(num)) {
				send(`<font color="#FF0000">Invalid argument.</font>`)
			} else {
				changeChannel(num)
			}
		})
		function send(msg) { command.message(`[camera-distance] : ` + msg) }
	} catch (e) { console.log(`[ERROR] -- channel-command module --`) }

}
