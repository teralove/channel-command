// OPCODE REQUIRED :
// - C_SELECT_CHANNEL
// - S_CURRENT_CHANNEL

// Version 1.35 r:00

module.exports = function CmdChannel(d) {

	let currentChannel = 0

	// code
	d.hook('S_CURRENT_CHANNEL', (e) => { currentChannel = e })
	//d.hook('S_PREPARE_SELECT_CHANNEL', (e) => { e.seconds = 0; return true })

	// helper
	function changeChannel(newChannel) {
		// in case of dungeon/instance
		if (currentChannel.channel > 20) return
		// index starts at 0
		newChannel -= 1
		// same channel
		if (newChannel === currentChannel.channel) {
			send(`Same channel selected.`.clr('FF0000'))
			return
		}
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
		function send(msg) { command.message(`[cmd-channel] : ` + [...arguments].join('\n\t - ')) }
	} catch (e) { console.log(`[ERROR] -- cmd-channel module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
