// OPCODE REQUIRED :
// - C_SELECT_CHANNEL
// - S_CURRENT_CHANNEL

module.exports = function ChannelCommand(dispatch) {
	
	let currentChannel = null
	
	// command
	try {
		const Command = require('command')
		const command = Command(dispatch)
		command.add(['channel', 'ch', 'c'], (num) => { changeChannel(num) })
	} catch (e) {
		console.log(`[ERROR] -- channel-command module --`)
	}

	// code
	dispatch.hook('S_CURRENT_CHANNEL', 2, (event) => { currentChannel = event })
	
	// helper
	function changeChannel(newChannel) {
		// If the current channel is absurdly high, then it's probably an instance id and the the player is in an instance.
		// Changing channels inside an instance will teleport the player out to the entrance/teleportal of the instance.
		if (currentChannel.channel > 20) return
		// proceed if the argument is a number.
		if (isNaN(newChannel)) return
		// decrement by 1, because C_SELECT_CHANNEL identifies channel 1 as 0
		newChannel -= 1

		dispatch.toServer('C_SELECT_CHANNEL', 1, {
			unk: 1,
			zone: currentChannel.zone,
			channel: newChannel
		})
	}
	
}
