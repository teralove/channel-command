// OPCODE REQUIRED :
// - C_SELECT_CHANNEL
// - S_CURRENT_CHANNEL

// Version 1.33 r:00

module.exports = function ChannelCommand(d) {

	let currentChannel = 0

	// code
	d.hook('S_CURRENT_CHANNEL', (e) => { currentChannel = e })

	// helper
	function changeChannel(newChannel) {
		// in case of dungeon/instance
		if (currentChannel.channel > 20) return
		// index starts at 0
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
			if (!isNaN(num)) changeChannel(num)
			else send(`Invalid argument.`.clr('FF0000'))
		})
		function send(msg) { command.message(`[camera-distance] : ` + msg) }
	} catch (e) { console.log(`[ERROR] -- channel-command module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
