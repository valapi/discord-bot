import { Formatters } from "discord.js";
import type { ModalSubmitInteraction } from "discord-modals";

import * as IngCore from '@ing3kth/core';
import type { EventExtraData } from "../interface/EventData";
import { getLanguageAndUndefined } from "../language/controller";

import * as process from 'process';
import * as fs from 'fs';

export default {
	name: 'modalSubmit',
	once: true,
	async execute(modal: ModalSubmitInteraction, _extraData: EventExtraData) {
		const ModalFolder = fs.readdirSync(`${process.cwd()}/dist/commands/modal`).filter(file => file.endsWith('.js'));

		ModalFolder.forEach(async (file) => {
			const _file = require(`${process.cwd()}/dist/commands/modal/${file.replace('.js', '')}`).default as {
				customId: string,
				execute: Function,
			};

			if (_file.customId === modal.customId) {
				await _file.execute(modal, _extraData);
				return;
			}
		});
	},
};