//vers 1.0

const format = require('./format.js');

module.exports = function ChannelCommand(dispatch) {
	
	let currentArea = null;
		
	dispatch.hook('S_CURRENT_CHANNEL', 1, function(event) {
		currentArea = event;
	});
		
    dispatch.hook('C_CHAT', 1, function(event) {
		let command = format.stripTags(event.message).split(' ');
		
		if (['!channel', '!ch', '!c'].includes(command[0].toLowerCase()) && command.length > 1) {
			changeChannel(parseInt(command[1]));
			return false;
		}
	});	
	
	function changeChannel(newChannel) {
/*
		// If the current channel is absurdly high, then it's probably an instance id and the the player is in an instance.
		// Changing channels inside an instance will teleportt the player out to the entrance/teleportal of the instance.
		if (currentArea.channel > 100) return;
*/
		// proceed if the argument is a number.
		if (isNaN(newChannel)) return;
		
		// decrement by 1, because C_SELECT_CHANNEL identifies channel 1 as 0
		newChannel -= 1;
				
		dispatch.toServer('C_SELECT_CHANNEL', 1, {
			unk: 1,
			zone: currentArea.zone,
			channel: newChannel,
		})
	}
	
	// slash support
	try {
		const Slash = require('slash')
		const slash = new Slash(dispatch)
		slash.on('channel', args => changeChannel(parseInt(args[1])))
		slash.on('ch', args => changeChannel(parseInt(args[1])))
		slash.on('c', args => changeChannel(parseInt(args[1])))
	} catch (e) {
		// do nothing because slash is optional
	}

}