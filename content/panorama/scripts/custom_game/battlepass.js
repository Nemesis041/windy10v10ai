(function () {
	$.Schedule(0.1, PregameSetup);
})();

function PregameSetup() {
    PlayerDataLoaded(GetPlayer());
}

function PlayerDataLoaded(player) {

	$.Msg("LocalDataLoaded");
	$.Msg(player);

	if(player == null) {
		return;
	}

	let chargePointTotal = player.chargePointTotal;
	let seasonPointTotal = player.seasonPointTotal;

	$("#ChargePoint").text = player.chargePointTotal;
	$("#SeasonPoint").text = player.seasonPointTotal;
	// let levelPointsLabel = $("#BpLevelNextRemainingNumber");
	// let levelPointsProgress = $("#BpLevelNextRemainingBarLeft");

	// let currentLevel = Math.floor(localPlayerStats.bp_points / 1000);
	// let currentPoints = Math.round(localPlayerStats.bp_points - currentLevel * 1000);

	// levelLabel.text = 1 + currentLevel;
	// levelPointsLabel.text = currentPoints + "/1000";
	// levelPointsProgress.style.width = currentPoints / 10 + "%";
	// CreatePatreonPetList();
	// CreatePatreonEffectList();
	// CreateBattlepassRewardsList();
	// CreateBattlepassArmoryList();

	$.Msg("BP Loaded!");
}

//RecreateBattlepass()
function RecreateBattlepass() {
	$("#PatreonPetsContent").RemoveAndDeleteChildren();
	$("#PatreonEmblemsContent").RemoveAndDeleteChildren();
	$("#BpRewardsContent").RemoveAndDeleteChildren();
	$.CreatePanel("Panel", $("#BpWindowMainPatreon"), "PatreonPetsContent");
	$.CreatePanel("Panel", $("#BpWindowMainPatreon"), "PatreonEmblemsContent");
	$.CreatePanel("Panel", $("#BpWindowMainRewards"), "BpRewardsContent");
	LocalDataLoaded();
}

function SetPatreonSelected() {
	$("#BpWindowMainPatreon").visible = true;
	$("#BpWindowMainRewards").visible = false;
	$("#BpWindowPatreonButton").checked = true;
	SetPetsSelected();
}

function SetBpSelected() {
	$("#BpWindowMainRewards").visible = true;
	$("#BpWindowMainPatreon").visible = false;
	$("#BpWindowRewardsButton").checked = true;
	SetRewardsSelected();
}

function SetPetsSelected() {
	$("#RBPatreonPets").checked = true;
	$("#PatreonPetsContent").visible = true;
}

function SetRewardsSelected() {
	$("#RBBpRewards").checked = true;
	$("#BpRewardsContent").visible = true;
}

function SwitchToPatreon() {
	$("#BpWindowMainPatreon").visible = true;
	$("#BpWindowMainRewards").visible = false;
	$("#BpRewardsContent").visible = false;
	$("#BpSettingsContent").visible = false;
	SetPetsSelected();
}

function SwitchToRewards() {
	$("#BpWindowMainPatreon").visible = false;
	$("#BpWindowMainRewards").visible = true;
	$("#PatreonEmblemsContent").visible = false;
	$("#PatreonPetsContent").visible = false;
	$("#PatreonSettingsContent").visible = false;
	SetRewardsSelected();
}

function SwitchToPatreonPets() {
	$("#PatreonPetsContent").visible = true;
	$("#PatreonEmblemsContent").visible = false;
	$("#PatreonSettingsContent").visible = false;
}

function SwitchToPatreonEmblems() {
	$("#PatreonEmblemsContent").visible = true;
	$("#PatreonPetsContent").visible = false;
	$("#PatreonSettingsContent").visible = false;
}

function SwitchToPatreonSettings() {
	$("#PatreonSettingsContent").visible = true;
	$("#PatreonEmblemsContent").visible = false;
	$("#PatreonPetsContent").visible = false;
}

function SwitchToBpRewards() {
	$("#BpRewardsContent").visible = true;
	$("#BpArmoryContent").visible = false;
	$("#BpSettingsContent").visible = false;
}

function SwitchToBpArmory() {
	$("#BpArmoryContent").visible = true;
	$("#BpRewardsContent").visible = false;
	$("#BpSettingsContent").visible = false;
}

function SwitchToBpSettings() {
	$("#BpSettingsContent").visible = true;
	$("#BpRewardsContent").visible = false;
	$("#BpArmoryContent").visible = false;
}

function SwitchPetEffects(sound) {
	if (!PetEffectSwitch) {
		PetEffectSwitch = 1;
		$("#AllowPetEffectsButtonCircle").style.transform = "translateX(24px)";
		$("#AllowPetEffectsButtonContainerActive").style.width = "100%";
		GameEvents.SendCustomGameEventToServer("enable_pet_effects", { playerid: Players.GetLocalPlayer() });
	} else {
		PetEffectSwitch = 0;
		$("#AllowPetEffectsButtonCircle").style.transform = "none";
		$("#AllowPetEffectsButtonContainerActive").style.width = "0%";
		GameEvents.SendCustomGameEventToServer("disable_pet_effects", { playerid: Players.GetLocalPlayer() });
	}
	equipButtonEvents["SwitchEffectButton"] = GameEvents.Subscribe(
		"pet_effects_switched",
		SetSwitchPetEffectsButtonReady
	);
	$("#AllowPetEffectsButton").SetPanelEvent("onactivate", () => {});
	if (!sound) Game.EmitSound("ui.click_alt");
}

function SetSwitchPetEffectsButtonReady() {
	GameEvents.Unsubscribe(equipButtonEvents["SwitchEffectButton"]);
	$("#AllowPetEffectsButton").SetPanelEvent("onactivate", () => {
		SwitchPetEffects();
	});
}

function SwitchPetFly(sound) {
	if (!PetFlySwitch) {
		PetFlySwitch = 1;
		$("#AllowPetFlyButtonCircle").style.transform = "translateX(24px)";
		$("#AllowPetFlyButtonContainerActive").style.width = "100%";
		GameEvents.SendCustomGameEventToServer("enable_pet_fly", { playerid: Players.GetLocalPlayer() });
	} else {
		PetFlySwitch = 0;
		$("#AllowPetFlyButtonCircle").style.transform = "none";
		$("#AllowPetFlyButtonContainerActive").style.width = "0%";
		GameEvents.SendCustomGameEventToServer("disable_pet_fly", { playerid: Players.GetLocalPlayer() });
	}
	equipButtonEvents["SwitchFlyButton"] = GameEvents.Subscribe("pet_fly_switched", SetSwitchPetFlyButtonReady);
	$("#AllowPetFlyButton").SetPanelEvent("onactivate", () => {});
	if (!sound) Game.EmitSound("ui.click_alt");
}

function SetSwitchPetFlyButtonReady() {
	GameEvents.Unsubscribe(equipButtonEvents["SwitchFlyButton"]);
	$("#AllowPetFlyButton").SetPanelEvent("onactivate", () => {
		SwitchPetFly();
	});
}

function SwitchTeleportStop(sound) {
	if (!TeleportStopSwitch) {
		TeleportStopSwitch = 1;
		$("#TeleportStopButtonCircle").style.transform = "translateX(24px)";
		$("#TeleportStopButtonContainerActive").style.width = "100%";
		GameEvents.SendCustomGameEventToServer("enable_teleport_req_stop", { playerid: Players.GetLocalPlayer() });
	} else {
		TeleportStopSwitch = 0;
		$("#TeleportStopButtonCircle").style.transform = "none";
		$("#TeleportStopButtonContainerActive").style.width = "0%";
		GameEvents.SendCustomGameEventToServer("disable_teleport_req_stop", { playerid: Players.GetLocalPlayer() });
	}
	equipButtonEvents["SwitchTeleportStopButton"] = GameEvents.Subscribe(
		"teleport_req_stop_switched",
		SetSwitchTeleportStopButtonReady
	);
	$("#TeleportStopButton").SetPanelEvent("onactivate", () => {});
	if (!sound) {
		Game.EmitSound("ui.click_alt");
	}
}

function SetSwitchTeleportStopButtonReady() {
	GameEvents.Unsubscribe(equipButtonEvents["SwitchTeleportStopButton"]);
	$("#TeleportStopButton").SetPanelEvent("onactivate", () => {
		SwitchTeleportStop();
	});
}

function SwitchQuickCast(sound) {
	if (!QuickCastSlotSwitch) {
		QuickCastSlotSwitch = 1;
		$("#QuickCastButtonCircle").style.transform = "translateX(24px)";
		$("#QuickCastButtonContainerActive").style.width = "100%";
		GameEvents.SendCustomGameEventToServer("enable_quickcast_slot", { playerid: Players.GetLocalPlayer() });
	} else {
		QuickCastSlotSwitch = 0;
		$("#QuickCastButtonCircle").style.transform = "none";
		$("#QuickCastButtonContainerActive").style.width = "0%";
		GameEvents.SendCustomGameEventToServer("disable_quickcast_slot", { playerid: Players.GetLocalPlayer() });
	}
	equipButtonEvents["SwitchQuickCastButton"] = GameEvents.Subscribe(
		"quickcast_slot_switched",
		SetSwitchQuickCastButtonReady
	);
	$("#QuickCastButton").SetPanelEvent("onactivate", () => {});
	if (!sound) {
		Game.EmitSound("ui.click_alt");
	}
}

function SetSwitchQuickCastButtonReady() {
	GameEvents.Unsubscribe(equipButtonEvents["SwitchQuickCastButton"]);
	$("#QuickCastButton").SetPanelEvent("onactivate", () => {
		SwitchQuickCast();
	});
}

function SwitchQuickCast2(sound) {
	if (!QuickCastSlot2Switch) {
		QuickCastSlot2Switch = 1;
		$("#QuickCastButtonCircle2").style.transform = "translateX(24px)";
		$("#QuickCastButtonContainerActive2").style.width = "100%";
		GameEvents.SendCustomGameEventToServer("enable_quickcast_slot2", { playerid: Players.GetLocalPlayer() });
	} else {
		QuickCastSlot2Switch = 0;
		$("#QuickCastButtonCircle2").style.transform = "none";
		$("#QuickCastButtonContainerActive2").style.width = "0%";
		GameEvents.SendCustomGameEventToServer("disable_quickcast_slot2", { playerid: Players.GetLocalPlayer() });
	}
	equipButtonEvents["SwitchQuickCastButton2"] = GameEvents.Subscribe(
		"quickcast_slot2_switched",
		SetSwitchQuickCastButton2Ready
	);
	$("#QuickCastButton2").SetPanelEvent("onactivate", () => {});
	if (!sound) {
		Game.EmitSound("ui.click_alt");
	}
}

function SetSwitchQuickCastButton2Ready() {
	GameEvents.Unsubscribe(equipButtonEvents["SwitchQuickCastButton2"]);
	$("#QuickCastButton2").SetPanelEvent("onactivate", () => {
		SwitchQuickCast2();
	});
}

function ToggleBP() {
	let state = $("#BPWindow");
	if (state.style.opacity == "0.0" || state.style.opacity == null) {
		state.style.opacity = "0.98";
		state.style.transform = "none";
		state.style.visibility = "visible";
	} else {
		state.style.opacity = "0.0";
		state.style.transform = "translateX(400px)";
		$.Schedule(0.3, CollapseBP);
	}
}

function CollapseBP() {
	$("#BPWindow").style.visibility = "collapse";
}

function ToggleSpraySettings() {
	$.Msg("Toggl")
}

function CreatePatreonPetList() {
	for (i = 0; i < pets.length; i++) {
		AddPatreonPet(pets[i][0], pets[i][1], pets[i][2]);
	}
	$("#BPButton").visible = true;
	SwitchPetEffects(true);
	SwitchPetFly(true);

	$("#HelpIcon").SetPanelEvent("onmouseover", () => {
		$.DispatchEvent("DOTAShowTextTooltip", $("#HelpIcon"), "Pets can only fly once you reach level 6");
	});
	$("#HelpIcon").SetPanelEvent("onmouseout", () => {
		$.DispatchEvent("DOTAHideTextTooltip");
	});
}

function AddPatreonPet(tier, name, imageSrc) {
	let localPlayerID = Game.GetLocalPlayerID();
	let localPlayerStats = CustomNetTables.GetTableValue("local_data", "localboard" + localPlayerID);

	let data_arrays = new Array();
	data_arrays["Devourling"] = new Array(devourlings, "DevourlingButton", 23);
	data_arrays["Doomling"] = new Array(doomlings, "DoomlingButton", 24);
	data_arrays["Huntling"] = new Array(huntlings, "HuntlingButton", 25);
	data_arrays["Krobeling"] = new Array(krobelings, "KrobelingButton", 26);
	data_arrays["Seekling"] = new Array(seeklings, "SeeklingButton", 27);
	data_arrays["Venoling"] = new Array(venolings, "VenolingButton", 28);
	data_arrays["Exalted Pets"] = new Array(exalted_pets, "ExaltedPetButton", 33);
	data_arrays["Baby Roshan"] = new Array(roshans, "RoshanButton", 0);
	data_arrays["Golem"] = new Array(golems, "GolemButton", 32);
	data_arrays["Special Roshan"] = new Array(cool_roshans, "SpecialRoshanButton", 1);
	data_arrays["Brightskye"] = new Array(brightskye, "BrightskyeButton", 2);
	data_arrays["Demiheroes"] = new Array(demiheroes, "DemiheroButton", 31);

	let panel = $.CreatePanel("Panel", $("#PatreonPetsContent"), "");
	panel.BLoadLayoutSnippet("Pet");
	panel.SetDialogVariable("PetName", name);
	panel.SetDialogVariable("PetTier", tier);
	panel.FindChildTraverse("PetImage").SetImage(imageSrc);
	panel.FindChildTraverse("PetTier").style.color = tiers[tier][1];

	if (tiers[tier][0] <= tiers[localPlayerStats.donator][0]) {
		panel.FindChildTraverse("EnablePet").SetHasClass("deactivated", false);
		panel.FindChildTraverse("EnablePet").SetHasClass("activated", true);
		panel.FindChildTraverse("EnablePet").SetPanelEvent("onactivate", () => {
			EquipPet(name);
			SetUnequipPetButton(panel.FindChildTraverse("EnablePet"), panel.FindChildTraverse("EnablePetLabel"), name);
			petButtons[name] = new Array(
				panel.FindChildTraverse("EnablePet"),
				panel.FindChildTraverse("EnablePetLabel")
			);
		});
	}

	if (data_arrays[name]) {
		let usedArray = data_arrays[name][0];
		let usedClass = data_arrays[name][1];
		let btId = data_arrays[name][2];
		let rsName = usedArray[0][0];
		let rsImage = usedArray[0][1];
		if (tiers[tier][0] <= tiers[localPlayerStats.donator][0]) {
			panel.FindChildTraverse("EnablePet").SetHasClass("deactivated", false);
			panel.FindChildTraverse("EnablePet").SetHasClass("activated", true);
			panel.FindChildTraverse("EnablePet").SetPanelEvent("onactivate", () => {
				EquipPet(rsName);
				SetUnequipPetButton(
					panel.FindChildTraverse("EnablePet"),
					panel.FindChildTraverse("EnablePetLabel"),
					rsName
				);
				petButtons[rsName] = new Array(
					panel.FindChildTraverse("EnablePet"),
					panel.FindChildTraverse("EnablePetLabel")
				);
			});
		}
		panel.SetDialogVariable("PetName", rsName);
		panel.FindChildTraverse("PetImage").SetImage(rsImage);
		for (j = 0; j < usedArray.length; j++) {
			let currentName = usedArray[j][0];
			let currentImage = usedArray[j][1];
			let roshOption = $.CreatePanel("Panel", panel.FindChildTraverse("RoshanOptions"), "BabyRoshanOption");
			roshOption.BLoadLayoutSnippet("BabyRoshanOption");
			roshOption.FindChildTraverse("ChooseRoshan").SetHasClass(usedClass + j, true);
			roshOption.FindChildTraverse("ChooseRoshan").SetPanelEvent("onactivate", () => {
				panel.SetDialogVariable("PetName", currentName);
				panel.FindChildTraverse("PetImage").SetImage(currentImage);
				Game.EmitSound("ui_rollover_today");
				if (selectedXButton[btId] != null) {
					selectedXButton[btId].SetHasClass("RoshanButtonSelected", false);
				}
				selectedXButton[btId] = roshOption.FindChildTraverse("ChooseRoshan");
				roshOption.FindChildTraverse("ChooseRoshan").SetHasClass("RoshanButtonSelected", true);
				if (tiers[tier][0] <= tiers[localPlayerStats.donator][0]) {
					panel.FindChildTraverse("EnablePet").SetPanelEvent("onactivate", () => {
						EquipPet(currentName);
						SetUnequipPetButton(
							panel.FindChildTraverse("EnablePet"),
							panel.FindChildTraverse("EnablePetLabel"),
							currentName
						);
						petButtons[currentName] = new Array(
							panel.FindChildTraverse("EnablePet"),
							panel.FindChildTraverse("EnablePetLabel")
						);
					});
				}
				if (selectedPetButton != null && selectedPetButton[0] == panel.FindChildTraverse("EnablePet")) {
					selectedPetButton[2] = currentName;
					panel.FindChildTraverse("EnablePet").SetHasClass("unequip", false);
					panel.FindChildTraverse("EnablePet").SetHasClass("reequip", true);
					panel.FindChildTraverse("EnablePetLabel").text = "REEQUIP";
				}
			});
			if (j == 0) {
				selectedXButton[btId] = roshOption.FindChildTraverse("ChooseRoshan");
				roshOption.FindChildTraverse("ChooseRoshan").SetHasClass("RoshanButtonSelected", true);
			}
		}
	}
}

function SetUnequipButtonReady(button) {
	GameEvents.Unsubscribe(equipButtonEvents[button.name]);
	let name = button.name;
	let petButton = buttonSaver[name];

	//if (selectedPetButton[0] == petButton[0]) {
	petButton[0].SetPanelEvent("onactivate", () => {
		UnequipPet(name);
		SetEquipPetButton(petButton[0], petButton[1], name);
	});
	petButton[0].SetHasClass("deactivated", false);
	petButton[0].SetHasClass("reequip", false);
	petButton[0].SetHasClass("unequip", true);
	//}
	/*else {
petButton[0].SetHasClass("deactivated", false);
petButton[0].SetHasClass("reequip", false);
petButton[0].SetHasClass("activated", true);
}*/
}

function GetDotaHud() {
	var panel = $.GetContextPanel();
	while (panel && panel.id !== "Hud") {
		panel = panel.GetParent();
	}

	if (!panel) {
		throw new Error("Could not find Hud root from panel with id: " + $.GetContextPanel().id);
	}

	return panel;
}

function FindDotaHudElement(id) {
	return GetDotaHud().FindChildTraverse(id);
}

function SetEquipPetButton(button, label, name) {
	unequipButtonEvents[name] = GameEvents.Subscribe("pet_unequipped", SetEquipButtonReady);

	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("unequip", false);
	button.SetHasClass("deactivated", true);
	label.text = "EQUIP";
}
function SetEquipButtonReady(button) {
	GameEvents.Unsubscribe(unequipButtonEvents[button.name]);
	let name = button.name;
	let petButton = buttonSaver[name];

	petButton[0].SetPanelEvent("onactivate", () => {
		EquipPet(name);
		SetUnequipPetButton(petButton[0], petButton[1], name);
	});
	petButton[0].SetHasClass("deactivated", false);
	petButton[0].SetHasClass("reequip", false);
	petButton[0].SetHasClass("activated", true);
}

function defaultPreviousButton(button, label, name) {
	button.SetPanelEvent("onactivate", () => {
		EquipPet(name);
		SetUnequipPetButton(button, label, name);
	});
	button.SetHasClass("unequip", false);
	button.SetHasClass("reequip", false);
	button.SetHasClass("activated", true);
	label.text = "EQUIP";
}

//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/


function SetUnequipEmblemButton(button, label, name) {
	equipButtonEvents[name] = GameEvents.Subscribe("effect_equipped", SetEffectUnequipButtonReady);
	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("activated", false);
	button.SetHasClass("deactivated", true);
	label.text = "REMOVE";

	if (buttonSaver[name] == null) {
		buttonSaver[name] = new Array(button, label, name);
	}
}

function SetEffectUnequipButtonReady(button) {
	GameEvents.Unsubscribe(equipButtonEvents[button.name]);
	let name = button.name;
	let effectButton = buttonSaver[name];
	let parentPanelName = helper[name];

	effectButton[0].SetPanelEvent("onactivate", () => {
		UnequipEffect(name);
		SetEquipEffectButton(effectButton[0], effectButton[1], name);
		panelClaimed[parentPanelName] = false;
	});
	effectButton[0].SetHasClass("deactivated", false);
	effectButton[0].SetHasClass("reequip", false);
	effectButton[0].SetHasClass("unequip", true);
}

function SetEquipEffectButton(button, label, name) {
	unequipButtonEvents[name] = GameEvents.Subscribe("effect_unequipped", SetEffectEquipButtonReady);

	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("unequip", false);
	button.SetHasClass("deactivated", true);
	label.text = "APPLY";
}
function SetEffectEquipButtonReady(button) {
	GameEvents.Unsubscribe(unequipButtonEvents[button.name]);
	let name = button.name;
	let effectButton = buttonSaver[name];
	let parentPanelName = helper[name];

	effectButton[0].SetPanelEvent("onactivate", () => {
		EquipEffect(name);
		SetUnequipEmblemButton(effectButton[0], effectButton[1], name);
		panelClaimed[parentPanelName] = true;
	});
	effectButton[0].SetHasClass("deactivated", false);
	effectButton[0].SetHasClass("reequip", false);
	effectButton[0].SetHasClass("activated", true);
}

//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/

function CreateBattlepassRewardsList() {
	let localPlayerID = Game.GetLocalPlayerID();
	let localPlayerStats = CustomNetTables.GetTableValue("local_data", "localboard" + localPlayerID);
	let currentLevel = Math.floor(localPlayerStats.bp_points / 1000) + 1;

	for (i = 0; i < battlepass_rewards.length; i++) {
		AddBpReward(battlepass_rewards[i][0], battlepass_rewards[i][1], battlepass_rewards[i][2], currentLevel);
	}

	$("#TeleportHelpIcon").SetPanelEvent("onmouseover", () => {
		$.DispatchEvent(
			"DOTAShowTextTooltip",
			$("#TeleportHelpIcon"),
			"Moving or casting a spell won't cancel a teleport in progress. Applies only to Teleport Scrolls or Boots of Travel 3."
		);
	});
	$("#TeleportHelpIcon").SetPanelEvent("onmouseout", () => {
		$.DispatchEvent("DOTAHideTextTooltip");
	});

	$("#QuickCastHelpIcon").SetPanelEvent("onmouseover", () => {
		$.DispatchEvent(
			"DOTAShowTextTooltip",
			$("#QuickCastHelpIcon"),
			'Enable this if you use Quickcast on your <font color="tomato">first</font> inventory slot.'
		);
	});
	$("#QuickCastHelpIcon").SetPanelEvent("onmouseout", () => {
		$.DispatchEvent("DOTAHideTextTooltip");
	});

	$("#QuickCastHelpIcon2").SetPanelEvent("onmouseover", () => {
		$.DispatchEvent(
			"DOTAShowTextTooltip",
			$("#QuickCastHelpIcon"),
			'Enable this if you use Quickcast on your <font color="tomato">second</font> inventory slot.'
		);
	});
	$("#QuickCastHelpIcon2").SetPanelEvent("onmouseout", () => {
		$.DispatchEvent("DOTAHideTextTooltip");
	});
}

function AddBpReward(level, name, imageSrc, currentLevel) {
	let localPlayerStats = CustomNetTables.GetTableValue("local_data", "localboard" + Game.GetLocalPlayerID());

	let panel = $.CreatePanel("Panel", $("#BpRewardsContent"), "");
	panel.BLoadLayoutSnippet("BpReward");
	panel.SetDialogVariable("RewardName", name);
	panel.SetDialogVariable("RewardTier", "Level " + level);
	panel.FindChildTraverse("RewardImage").SetImage(imageSrc);

	let data_arrays = new Array();
	data_arrays["High Five"] = new Array(high_fives, "HighFiveButton", 5);
	data_arrays["T1 Fountain Heal"] = new Array(t1_fountain, "FountainButton", 6);
	data_arrays["T1 Teleport Effect"] = new Array(t1_teleport, "ThemeButton", 7);
	data_arrays["T1 Blink Effect"] = new Array(t1_blink, "ThemeButton", 8);
	data_arrays["Level Up Effect"] = new Array(level_up_fx, "ThemeButton", 9);
	data_arrays["T2 Fountain Heal"] = new Array(t2_fountain, "FountainButton", 10);
	data_arrays["T2 Teleport Effect"] = new Array(t2_teleport, "ThemeButton", 11);
	data_arrays["T2 Blink Effect"] = new Array(t2_blink, "ThemeButton", 12);
	data_arrays["Mekansm Effect"] = new Array(mekansm_fx, "LimitedThemeButton", 13);
	data_arrays["Phase Boots"] = new Array(phase_fx, "LimitedThemeButton", 14);
	data_arrays["T3 Fountain Heal"] = new Array(t3_fountain, "FountainButton", 15);
	data_arrays["Maelstrom Effect"] = new Array(maelstrom_fx, "LimitedThemeButton", 16);
	data_arrays["T3 Teleport Effect"] = new Array(t3_teleport, "ThemeButton", 17);
	data_arrays["Shiva's Guard"] = new Array(shivas_fx, "LimitedThemeButton", 18);
	data_arrays["Radiance Effect"] = new Array(radiance_fx, "LimitedThemeButton", 19);
	data_arrays["Attack Modifier"] = new Array(attack_fx, "AttackModButton", 20);
	data_arrays["Dagon Effect"] = new Array(dagon_fx, "DagonButton", 21);

	if (currentLevel >= level) {
		panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", false);
		panel.FindChildTraverse("EnableReward").SetHasClass("activated", true);
		panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {
			EquipReward(name);
			SetUnequipRewardButton(
				panel.FindChildTraverse("EnableReward"),
				panel.FindChildTraverse("EnableRewardLabel"),
				name
			);
			rewardButtons[name] = new Array(
				panel.FindChildTraverse("EnableReward"),
				panel.FindChildTraverse("EnableRewardLabel")
			);
		});
	}

	if (data_arrays[name]) {
		let usedArray = data_arrays[name][0];
		let usedClass = data_arrays[name][1];
		let btId = data_arrays[name][2];
		let rLevel = usedArray[0][0];
		let rName = usedArray[0][1];
		let rImage = usedArray[0][2];

		if (currentLevel >= rLevel) {
			panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", false);
			panel.FindChildTraverse("EnableReward").SetHasClass("activated", true);
			panel.FindChildTraverse("EnableRewardLabel").text = "APPLY";
			panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {
				EquipReward(rName);
				SetUnequipRewardButton(
					panel.FindChildTraverse("EnableReward"),
					panel.FindChildTraverse("EnableRewardLabel"),
					rName
				);
				rewardButtons[rName] = new Array(
					panel.FindChildTraverse("EnableReward"),
					panel.FindChildTraverse("EnableRewardLabel")
				);
				panelClaimed[name] = true;
			});
		} else {
			panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {});
			panel.FindChildTraverse("EnableReward").SetHasClass("activated", false);
			panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", true);
			panel.FindChildTraverse("EnableReward").SetHasClass("reequip", false);
			panel.FindChildTraverse("EnableRewardLabel").text = "LOCKED";
		}
		panel.SetDialogVariable("RewardName", rName);
		panel.FindChildTraverse("RewardImage").SetImage(rImage);
		panel.SetDialogVariable("RewardTier", "Level " + rLevel);
		for (j = 0; j < usedArray.length; j++) {
			let currentRewardLevel = usedArray[j][0];
			let currentName = usedArray[j][1];
			let currentImage = usedArray[j][2];
			helper[currentName] = name;
			let rewardOption = $.CreatePanel("Panel", panel.FindChildTraverse("RewardOptions"), "RewardOption");
			rewardOption.BLoadLayoutSnippet("RewardOption");
			rewardOption.FindChildTraverse("ChooseReward").SetHasClass(usedClass + j, true);
			rewardOption.FindChildTraverse("ChooseReward").SetPanelEvent("onactivate", () => {
				panel.SetDialogVariable("RewardName", currentName);
				panel.FindChildTraverse("RewardImage").SetImage(currentImage);
				panel.SetDialogVariable("RewardTier", "Level " + currentRewardLevel);
				Game.EmitSound("ui_rollover_today");
				if (selectedXButton[btId] != null) {
					selectedXButton[btId].SetHasClass("RewardButtonSelected", false);
				}
				selectedXButton[btId] = rewardOption.FindChildTraverse("ChooseReward");
				rewardOption.FindChildTraverse("ChooseReward").SetHasClass("RewardButtonSelected", true);
				if (currentLevel >= currentRewardLevel) {
					panel.FindChildTraverse("EnableReward").SetHasClass("activated", true);
					panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", false);
					panel.FindChildTraverse("EnableRewardLabel").text = "APPLY";
					panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {
						EquipReward(currentName);
						SetUnequipRewardButton(
							panel.FindChildTraverse("EnableReward"),
							panel.FindChildTraverse("EnableRewardLabel"),
							currentName
						);
						rewardButtons[name] = new Array(
							panel.FindChildTraverse("EnableReward"),
							panel.FindChildTraverse("EnableRewardLabel")
						);
						panelClaimed[name] = true;
					});
				} else {
					panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {});
					panel.FindChildTraverse("EnableReward").SetHasClass("activated", false);
					panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", true);
					panel.FindChildTraverse("EnableReward").SetHasClass("reequip", false);
					panel.FindChildTraverse("EnableRewardLabel").text = "LOCKED";
				}

				if (panelClaimed[name] == true) {
					if (currentLevel >= currentRewardLevel) {
						panel.FindChildTraverse("EnableReward").SetHasClass("activated", true);
						panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", false);
						panel.FindChildTraverse("EnableReward").SetHasClass("unequip", false);
						panel.FindChildTraverse("EnableReward").SetHasClass("reequip", true);
						panel.FindChildTraverse("EnableRewardLabel").text = "REAPPLY";
					} else {
						panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {});
						panel.FindChildTraverse("EnableReward").SetHasClass("activated", false);
						panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", true);
						panel.FindChildTraverse("EnableReward").SetHasClass("reequip", false);
						panel.FindChildTraverse("EnableRewardLabel").text = "LOCKED";
					}
				}
			});
			if (j == 0) {
				selectedXButton[btId] = rewardOption.FindChildTraverse("ChooseReward");
				rewardOption.FindChildTraverse("ChooseReward").SetHasClass("RewardButtonSelected", true);
			}
		}
	}
}

function SetUnequipRewardButton(button, label, name) {
	equipButtonEvents[name] = GameEvents.Subscribe("reward_equipped", SetRewardUnequipButtonReady);
	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("activated", false);
	button.SetHasClass("deactivated", true);
	label.text = "REMOVE";

	if (buttonSaver[name] == null) {
		buttonSaver[name] = new Array(button, label, name);
	}
}

function SetRewardUnequipButtonReady(button) {
	GameEvents.Unsubscribe(equipButtonEvents[button.name]);
	let name = button.name;
	let rewardButton = buttonSaver[name];
	let parentPanelName = helper[name];
	rewardButton[0].SetPanelEvent("onactivate", () => {
		UnequipReward(name);
		SetEquipRewardButton(rewardButton[0], rewardButton[1], name);
		panelClaimed[parentPanelName] = false;
	});
	rewardButton[0].SetHasClass("deactivated", false);
	rewardButton[0].SetHasClass("reequip", false);
	rewardButton[0].SetHasClass("unequip", true);
}

function SetEquipRewardButton(button, label, name) {
	unequipButtonEvents[name] = GameEvents.Subscribe("reward_unequipped", SetRewardEquipButtonReady);

	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("unequip", false);
	button.SetHasClass("deactivated", true);
	label.text = "APPLY";
}
function SetRewardEquipButtonReady(button) {
	GameEvents.Unsubscribe(unequipButtonEvents[button.name]);
	let name = button.name;
	let rewardButton = buttonSaver[name];
	let parentPanelName = helper[name];
	rewardButton[0].SetPanelEvent("onactivate", () => {
		EquipReward(name);
		SetUnequipRewardButton(rewardButton[0], rewardButton[1], name);
		panelClaimed[parentPanelName] = true;
	});
	rewardButton[0].SetHasClass("deactivated", false);
	rewardButton[0].SetHasClass("reequip", false);
	rewardButton[0].SetHasClass("activated", true);
}

//*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/

//CreateBattlepassArmoryList();
function CreateBattlepassArmoryList() {
	let localPlayerID = Game.GetLocalPlayerID();
	let localPlayerHeroName = Players.GetPlayerSelectedHero(localPlayerID);
	let image_url = "file://{resources}/images/custom_game/battlepass/armory/";
	let localPlayerStats = CustomNetTables.GetTableValue("local_data", "localboard" + localPlayerID);
	let currentLevel = Math.floor(localPlayerStats.bp_points / 1000) + 1;

	if (armory_content[localPlayerHeroName] != null) {
		for (i = 0; i < armory_content[localPlayerHeroName].length; i++) {
			let item_array = armory_content[localPlayerHeroName][i];
			let sStyle = item_array[7] || "0";
			AddBpArmoryItem(
				item_array[0],
				item_array[1],
				image_url + localPlayerHeroName + "/" + item_array[4],
				currentLevel,
				item_array[2],
				item_array[3],
				item_array[5],
				item_array[6],
				sStyle
			);
		}
	}
}

function AddBpArmoryItem(level, name, imageSrc, currentLevel, itemID, itemSlot, abilityname, vSlots, sStyle) {
	let localPlayerStats = CustomNetTables.GetTableValue("local_data", "localboard" + Game.GetLocalPlayerID());
	let bUnlocked = false;
	let panel = $.CreatePanel("Panel", $("#BpArmoryContent"), "");
	panel.BLoadLayoutSnippet("BpReward");
	panel.SetDialogVariable("RewardName", name);
	panel.FindChildTraverse("RewardImage").SetImage(imageSrc);
	panel.FindChildTraverse("EnableRewardLabel").text = "EQUIP";

	if (typeof level == "string") {
		panel.SetDialogVariable("RewardTier", level);
		panel.FindChildTraverse("RewardTier").style.color = tiers[level][1];
		if (tiers[level][0] <= tiers[localPlayerStats.donator][0]) {
			bUnlocked = true;
		}
	} else {
		panel.SetDialogVariable("RewardTier", "Level " + level);
		if (currentLevel >= level) {
			bUnlocked = true;
		}
	}

	if (bUnlocked) {
		panel.FindChildTraverse("EnableReward").SetHasClass("deactivated", false);
		panel.FindChildTraverse("EnableReward").SetHasClass("activated", true);
		panel.FindChildTraverse("EnableReward").SetPanelEvent("onactivate", () => {
			EquipArmoryItem(name, itemID, itemSlot, abilityname, vSlots, sStyle);
			SetUnequipArmoryItemButton(
				panel.FindChildTraverse("EnableReward"),
				panel.FindChildTraverse("EnableRewardLabel"),
				name,
				itemID,
				itemSlot,
				abilityname,
				vSlots,
				sStyle
			);
			rewardButtons[name] = new Array(
				panel.FindChildTraverse("EnableReward"),
				panel.FindChildTraverse("EnableRewardLabel")
			);
		});
	}
}

function EquipArmoryItem(name, ID, slot, abilityname, vSlots, sStyle) {
	GameEvents.SendCustomGameEventToServer("equip_armory_item", {
		playerid: Players.GetLocalPlayer(),
		rewardname: name,
		id: ID,
		slot: slot,
		abilityname: abilityname,
		slots: vSlots,
		style: sStyle,
	});
	$.Schedule(0.5, () => {
		GameEvents.SendEventClientSide("update_cosmetic_icon", {
			hero_id: Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()),
			ability: abilityname,
		});
	});
	Game.EmitSound("BP.Equip.Pet");
}

function UnequipArmoryItem(name, slot, abilityname, vSlots, sStyle) {
	GameEvents.SendCustomGameEventToServer("unequip_armory_item", {
		playerid: Players.GetLocalPlayer(),
		rewardname: name,
		slot: slot,
		abilityname: abilityname,
		slots: vSlots,
		style: sStyle,
	});
	$.Schedule(0.5, () => {
		GameEvents.SendEventClientSide("update_cosmetic_icon", {
			hero_id: Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()),
			ability: abilityname,
		});
	});
	Game.EmitSound("ui_rollover_logo");
}

function SetUnequipArmoryItemButton(button, label, name, id, slot, abilityname, vSlots, sStyle) {
	equipButtonEvents[name] = new Array(
		GameEvents.Subscribe("armory_item_equipped", SetArmoryItemUnequipButtonReady),
		id,
		slot,
		abilityname,
		vSlots,
		sStyle
	);
	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("activated", false);
	button.SetHasClass("deactivated", true);
	label.text = "REMOVE";

	if (buttonSaver[name] == null) {
		buttonSaver[name] = new Array(button, label, name);
	}
}

function SetArmoryItemUnequipButtonReady(button) {
	GameEvents.Unsubscribe(equipButtonEvents[button.name][0]);
	let name = button.name;
	let id = equipButtonEvents[button.name][1];
	let slot = equipButtonEvents[button.name][2];
	let abilityname = equipButtonEvents[button.name][3];
	let vSlots = equipButtonEvents[button.name][4];
	let sStyle = equipButtonEvents[button.name][5];
	let rewardButton = buttonSaver[name];
	let parentPanelName = helper[name];
	rewardButton[0].SetPanelEvent("onactivate", () => {
		UnequipArmoryItem(name, slot, abilityname, vSlots, sStyle);
		SetEquipArmoryItemButton(rewardButton[0], rewardButton[1], name, id, slot, abilityname, vSlots, sStyle);
		panelClaimed[parentPanelName] = false;
	});
	rewardButton[0].SetHasClass("deactivated", false);
	rewardButton[0].SetHasClass("reequip", false);
	rewardButton[0].SetHasClass("unequip", true);
}

function SetEquipArmoryItemButton(button, label, name, id, slot, abilityname, vSlots, sStyle) {
	unequipButtonEvents[name] = new Array(
		GameEvents.Subscribe("armory_item_unequipped", SetArmoryItemEquipButtonReady),
		id,
		slot,
		abilityname,
		vSlots,
		sStyle
	);

	button.SetPanelEvent("onactivate", () => {});
	button.SetHasClass("unequip", false);
	button.SetHasClass("deactivated", true);
	label.text = "EQUIP";
}
function SetArmoryItemEquipButtonReady(button) {
	GameEvents.Unsubscribe(unequipButtonEvents[button.name][0]);
	let id = unequipButtonEvents[button.name][1];
	let slot = unequipButtonEvents[button.name][2];
	let abilityname = unequipButtonEvents[button.name][3];
	let vSlots = unequipButtonEvents[button.name][4];
	let sStyle = equipButtonEvents[button.name][5];
	let name = button.name;
	let rewardButton = buttonSaver[name];
	let parentPanelName = helper[name];
	rewardButton[0].SetPanelEvent("onactivate", () => {
		EquipArmoryItem(name, id, slot, abilityname, vSlots, sStyle);
		SetUnequipArmoryItemButton(rewardButton[0], rewardButton[1], name, id, slot, abilityname, vSlots, sStyle);
		panelClaimed[parentPanelName] = true;
	});
	rewardButton[0].SetHasClass("deactivated", false);
	rewardButton[0].SetHasClass("reequip", false);
	rewardButton[0].SetHasClass("activated", true);
}


function UpdateScoreboard() {
	let hScoreboard = FindDotaHudElement("scoreboard");

	if (hScoreboard) {
		if (hScoreboard.BHasClass("ScoreboardClosed")) {
			$("#ScoreboardTipPanel").style.visibility = "collapse";
		} else {
			$("#ScoreboardTipPanel").style.visibility = "visible";
		}

		if (!bTippingAvailable && bScoreTipping && FindDotaHudElement("Background")) {
			for (let nID = 0; nID < 5; nID++) {
				if (Players.IsValidPlayerID(nID) && nID != Game.GetLocalPlayerID()) {
					let hScoreButton = $("#ScoreTipButton" + nID);

					if (hScoreButton) {
						if (!hScoreButton.BHasClass("GrayedTip")) hScoreButton.AddClass("GrayedTip");

						hScoreButton.SetPanelEvent("onactivate", () => {});
					}
				}
			}
		}
	}
}