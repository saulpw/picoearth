# picoearth
A very small simulation of earth, in the style of an incremental game ("Human Clicker")

## HOW-TO update techs tree
Technology can be added or modified by modifying the json object `g_techTree` in *techtree.js*.

### Format

To add a new tech, append to `g_techTree` the format as specified below:

	"<string (tech-name)>": {
		"unlock":<boolean>,
		"require": {
			"population": <integer>,
			"year": <integer>,
			"techs": {
				["<string>", "<string>",...]
			}
		},
		"per-year": {
			"death-per-thousand": <float>,
			"birth-per-thousand":<float>,
			"food-source": <float>
		},
		"adopt-percent": <float>
	}
	
- Supply the **"tech-name"** string (no space allowed) as the initial key. This string will be used to display the technology's name whenever it's mentioned in the game.
- **"unlocked"**: Supply the initial "unlocked" *boolean* state of the technology. Typically set as `false`, the value is updated to `true` when the technology is unlocked.
- **"require"**: The requirements to unlock the technology.
	- **"population"**: Supply the required population *integer* when the technology can be unlocked.
	- **"year"**: Supply the required year *integer* (negative for BC years) when the technology can be unlocked.
	- **"techs" (optional)**: When included, supply a list of existing technologies *strings* that are required to be unlocked prior to this technology.
- **"per-year"**: The stat changes per adoption percentage per year of the technology.
	- **"death-per-thousand" (optional)**: Supply the *float* value of death per thousand per percentage per year.
	- **"birth-per-thousand" (optional)**: Supply the *float* value of death- per-thousand per percentage per year.
	- **food-source" (optional)**: Supply the *float* value of food source change per year.
- **"adopt-percent"**: Supply the initial adoption percentage when this technology is unlocked. This value is updated when player promotes/bans the technology.

## HOW-TO update events tree

World events can be added or modified by modifying the json object `g_worldEvents` in *events.js*.

### Generic event format
To add a new generic event - an informational event with no effects to the world - append to the **"generic"** key in `g_worldEvents` the format as specified below:

	"<string (event-name)>": {
		"message": "<string>",
		"conditions": {
			"year": <integer>
		}
	}

- Supply the **"event-name"** string (no space allowed) as the initial key. This string will be used to display the event name whenever it's mentioned in the game.
- **"message"**: Supply the message *string* to be display when this event is triggered.
- **"conditions"**: Supply the conditions to trigger the event.
	- **"year"**: Supply the year *integer* when the event should be triggered.

### Natural disaster event format

To add a new natural disaster event - an event which affects population (death) and abject suffering - append to the **"generic"** key in `g_worldEvents` the format as specified below:

	"<string (event-name)>": {
		"message": "<string>",
		"conditions": {
			"year": <integer>
		},
		"effects": {
			"death": <integer>
		}
	}

- Supply the **"event-name"** string (no space allowed) as the initial key. This string will be used to display the event name whenever it's mentioned in the game.
- **"message"**: Supply the message *string* to be display when this event is triggered.
- **"conditions"**: The conditions to trigger the event.
	- **"year"**: Supply the year *integer* when the event should be triggered.
- **effects"**: The effects caused by this event.
	- **"death"**: Supply the death *integer* that affects population when the event is triggered.