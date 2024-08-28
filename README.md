# Discord Voice Channel Management Bot

## Table of Contents

1. [Introduction](#introduction)
2. [How the VC are Saved (Database)](#how-the-vc-is-saved)
3. [How the Menu Command Works](#how-the-menu-command-works)
4. [Handling Interactions](#handling-interactions)
5. [Additional Features](#additional-features)

## Introduction

The Discord Voice Channel Management Bot provides an enhanced interface for managing voice channels within a Discord server. This bot allows users to perform various actions on voice channels using both command inputs and interactive buttons. Features include locking/unlocking channels, setting user limits, inviting users, and more.

## How the VC is Saved (Database)

Voice channels are managed through an embedded data structure stored in a `data.json` file. The bot maintains this data to track voice channel ownership and related settings. 

1. **Voice Channel Creation**: When a user creates a new voice channel via the bot, the channel is registered in the `data.json` file under a `channels` object. Each entry includes the channel ID and the ID of the owner who created the channel.

2. **Channel Deletion**: If a voice channel is deleted, the bot removes the channel's record from the `data.json` file. If the channel was deleted but remains in the file with `ownerId` set to `null`, it indicates an error and should be cleaned up properly.

3. **Ownership Changes**: The bot allows users to claim ownership or transfer ownership of a voice channel. These changes are reflected in the `data.json` file, ensuring that the ownership details are up-to-date.

4. **Button Interactions**: Interactions with buttons such as "Lock", "Unlock", "Hide", and "Set Limit" are processed to update channel settings accordingly. The `data.json` file is updated to reflect any changes made through these actions.

## How the Menu Command Works

The `/menu` command provides a dynamic and interactive way to manage voice channels through a series of buttons embedded in a message. This command:

1. **Receives Input**: Users invoke the `/menu` command and specify a target text channel where the management panel should be sent. The command is designed to handle this input and ensure the specified channel is a valid text channel.

2. **Generates Buttons**: The command creates a series of buttons for various actions:
   - **Row 1**: Contains buttons for locking, unlocking, hiding, and unhiding the voice channel.
   - **Row 2**: Contains buttons for setting user limits, inviting users, banning users, and permitting users.
   - **Row 3**: Contains buttons for renaming the channel, claiming ownership, transferring ownership, and changing the channel region.

3. **Sends the Embed**: An `EmbedBuilder` is used to format and style the message that contains the buttons. This message is then sent to the specified text channel, providing users with a user-friendly interface to manage their voice channels.

4. **Interaction Handling**: Once the embed with buttons is sent, users can interact with these buttons to perform actions on their voice channels. Each button triggers specific logic to modify the voice channel based on the button pressed.

## Handling Interactions

The bot processes different types of interactions using event handlers:

1. **Button Interactions**: The `handleButtonInteraction` function handles actions like locking, unlocking, hiding, unhiding, setting limits, inviting, banning, permitting, renaming, claiming ownership, and transferring ownership. Each interaction is processed based on the user's permissions and the state of the voice channel.

2. **Modal Submissions**: The `handleModalSubmit` function processes user input from modals for actions like setting user limits, renaming channels, banning or permitting users, claiming ownership, and transferring ownership. It updates the `data.json` file accordingly.

3. **Select Menus**: The bot also handles select menu interactions for changing the voice channel's region, ensuring that the region is updated based on the user's selection.

4. **Voice State Updates**: The bot tracks voice state changes to create and manage voice channels dynamically. It handles scenarios where channels are deleted and ensures the `data.json` file remains synchronized with the actual state of the channels.

## Additional Features

- **Dynamic Data Handling**: The bot maintains and updates channel data dynamically to reflect changes in voice channel ownership and settings.
- **Interactive UI**: Provides users with an easy-to-use interface for managing voice channels without the need to repeatedly invoke commands.
- **Error Handling**: Includes error handling mechanisms to manage issues such as invalid user IDs, permissions errors, and interactions with non-existent channels.

> [!WARNING]
> This is a single-guild-bot, multi-guild will not work!