# Retroactive Advantage D&D5e

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FElfFriend-DnD%2Ffoundryvtt-retroactive-advantage-5e%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange)
![Latest Release Download Count](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets%5B1%5D.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2FElfFriend-DnD%2Ffoundryvtt-retroactive-advantage-5e%2Freleases%2Flatest)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fretroactive-advantage-5e&colorB=4aa94a)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fretroactive-advantage-5e%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/retroactive-advantage-5e/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fretroactive-advantage-5e%2Fshield%2Fcomments)](https://www.foundryvtt-hub.com/package/retroactive-advantage-5e/)

[![ko-fi](https://img.shields.io/badge/-buy%20me%20a%20coke-%23FF5E5B)](https://ko-fi.com/elffriend)
[![patreon](https://img.shields.io/badge/-patreon-%23FF424D)](https://www.patreon.com/ElfFriend_DnD)

This module allows a user to re-roll a d20 roll from the output chat card to change its advantage status. It does not affect any other module's logic based on the original roll.

## Features

Provides buttons for any D20 roll chat card to change the roll's advantage status and resulting display. As much as possible, all existing dice rolls which are still relevant to the new mode will be used.

For example:
If a d20 roll was rolled with advantage, the user will be able to set that to not have advantage or to instead be at disadvantage.

## Out of Scope

This module does not interact with any other module which might rely on the results of a dice roll (for example "Attack Roll Check D&D5e"). Any automations based on attack rolls, saving throws, etc would be far too complex to attempt to 'undo and redo' with the new result.

## Compatibility

Compatible with:
- Core dnd5e roller
- Minimal Rolling Enhancements

Not Compatible with:
- Better Rolls 5e (has this functionality baked in)
- Midi QOL (would not react well to a workflow changing after starting)
