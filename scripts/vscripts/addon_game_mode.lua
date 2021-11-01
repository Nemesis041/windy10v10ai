function Precache( context )
	PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_alchemist.vsndevts", context )
	PrecacheResource("soundfile", "soundevents/game_sounds_custom.vsndevts", context )
end

if AIGameMode == nil then
	_G.AIGameMode = class({}) -- put in the global scope
end

require('timers')
require('settings')
require('events')
require('util')
require('bot/bot_think_modifier')

function Activate()
	AIGameMode:InitGameMode()
end


function AIGameMode:InitGameMode()
	AIGameMode:InitGameOptions()
	AIGameMode:InitEvents()
	AIGameMode:LinkLuaModifiers()
	print("DOTA 2 AI Wars Loaded.")
end


function AIGameMode:InitGameOptions()
	GameRules:SetCustomGameSetupAutoLaunchDelay( AUTO_LAUNCH_DELAY )
	GameRules:LockCustomGameSetupTeamAssignment( LOCK_TEAM_SETUP )
	GameRules:EnableCustomGameSetupAutoLaunch( ENABLE_AUTO_LAUNCH )
	GameRules:SetHeroSelectionTime( HERO_SELECTION_TIME )
	GameRules:SetPreGameTime( PRE_GAME_TIME )
	GameRules:SetCustomGameTeamMaxPlayers(DOTA_TEAM_GOODGUYS, RADIANT_PLAYER_COUNT)
	GameRules:SetCustomGameTeamMaxPlayers(DOTA_TEAM_BADGUYS, DIRE_PLAYER_COUNT)
	GameRules:SetStrategyTime(20)
	GameRules:SetShowcaseTime(0)
	GameRules:GetGameModeEntity():SetFreeCourierModeEnabled(true)

	GameRules.DropTable = LoadKeyValues("scripts/kv/item_drops.kv")
	-- GameRules:SetUseBaseGoldBountyOnHeroes( true )
end


function AIGameMode:InitEvents()
	ListenToGameEvent("game_rules_state_change", Dynamic_Wrap(AIGameMode, "OnGameStateChanged"), self)
	ListenToGameEvent("dota_player_gained_level", Dynamic_Wrap(AIGameMode, "OnPlayerLevelUp"), self)
	ListenToGameEvent("npc_spawned", Dynamic_Wrap(AIGameMode, "OnNPCSpawned"), self)
	ListenToGameEvent("entity_killed", Dynamic_Wrap(AIGameMode, "OnEntityKilled"), self)
	--JS events
	CustomGameEventManager:RegisterListener("loading_set_options", function (eventSourceIndex, args) return AIGameMode:OnGetLoadingSetOptions(eventSourceIndex, args) end)
end


function AIGameMode:LinkLuaModifiers()
	LinkLuaModifier("modifier_courier_speed", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_melee_resistance", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_bot_attack_tower_pick_rune", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_tower_power", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_tower_endure", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_tower_heal", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_axe_thinker", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_sniper_assassinate_thinker", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
	LinkLuaModifier("modifier_out_of_world", "global_modifiers.lua", LUA_MODIFIER_MOTION_NONE)
end


function AIGameMode:PreGameOptions()
	self.iDesiredRadiant = self.iDesiredRadiant or RADIANT_PLAYER_COUNT
	self.iDesiredDire = self.iDesiredDire or DIRE_PLAYER_COUNT
	self.fRadiantGoldMultiplier = self.fRadiantGoldMultiplier or RADIANT_GOLD_MULTIPLIER
	self.fRadiantXPMultiplier = self.fRadiantXPMultiplier or RADIANT_XP_MULTIPLIER
	self.fDireXPMultiplier = self.fDireXPMultiplier or DIRE_XP_MULTIPLIER
	self.fDireGoldMultiplier = self.fDireGoldMultiplier or DIRE_GOLD_MULTIPLIER
	self.iGoldPerTick = self.iGoldPerTick or GOLD_PER_TICK
	self.iGoldTickTime = self.iGoldTickTime or GOLD_TICK_TIME
	self.iRespawnTimePercentage = self.iRespawnTimePercentage or 1
	self.iMaxLevel = self.iMaxLevel or MAX_LEVEL
	self.iRadiantTowerPower = self.iRadiantTowerPower or 3
	self.iDireTowerPower = self.iDireTowerPower or 3
	self.iRadiantTowerEndure = self.iRadiantTowerEndure or 3
	self.iDireTowerEndure = self.iDireTowerEndure or 3
	self.iRadiantTowerHeal = self.iRadiantTowerHeal or 0
	self.iDireTowerHeal = self.iDireTowerHeal or 0
	self.iStartingGoldPlayer = self.iStartingGoldPlayer or 600
	self.iStartingGoldBot = self.iStartingGoldBot or 600
	self.bSameHeroSelection = self.bSameHeroSelection or 1
	self.bFastCourier = self.bFastCourier or 1
	self.fGameStartTime = 0
	GameRules:SetGoldPerTick(self.iGoldPerTick)
	GameRules:SetGoldTickTime(self.iGoldTickTime)
	GameRules:GetGameModeEntity():SetModifyGoldFilter( Dynamic_Wrap( AIGameMode, "FilterGold" ), self )
	GameRules:GetGameModeEntity():SetModifyExperienceFilter( Dynamic_Wrap( AIGameMode, "FilterXP" ), self )
	GameRules:GetGameModeEntity():SetRuneSpawnFilter( Dynamic_Wrap( AIGameMode, "FilterRune" ), self )
	GameRules:GetGameModeEntity():SetItemAddedToInventoryFilter( Dynamic_Wrap( AIGameMode, "FilterItemAdd" ), self )
	GameRules:GetGameModeEntity():SetTowerBackdoorProtectionEnabled( true )
	GameRules:GetGameModeEntity():SetMaximumAttackSpeed( 1000 )
	GameRules:SetUseUniversalShopMode( true )

	-------------------------
	AIGameMode:SpawnNeutralCreeps30sec()
	AIGameMode:AddCreepsSkill()


	if self.bSameHeroSelection == 1 then
		GameRules:SetSameHeroSelectionEnabled( true )
	end
	if self.iMaxLevel ~= 30 then
		local tLevelRequire = {
			0,
			180,
			510,
			960,
			1520,
			2110,
			2850,
			3640,
			4480,
			5370,
			6310,
			7380,
			8580,
			10005,
			11555,
			13230,
			15030,
			16955,
			18955,
			21045,
			23145,
			25495,
			28095,
			30945,
			34045,
			37545,
			42045,
			47545,
			54045,
			61545,
		} -- value fixed
		local iRequireLevel = tLevelRequire[30]
		for i = 31, self.iMaxLevel do
			iRequireLevel = iRequireLevel+i*200
			table.insert(tLevelRequire, iRequireLevel)
		end
		GameRules:GetGameModeEntity():SetUseCustomHeroLevels( true )
		GameRules:SetUseCustomHeroXPValues( true )
		GameRules:GetGameModeEntity():SetCustomHeroMaxLevel(self.iMaxLevel)
		GameRules:GetGameModeEntity():SetCustomXPRequiredToReachNextLevel(tLevelRequire)
	end
	self.PreGameOptionsSet = true
end

function AIGameMode:SpawnNeutralCreeps30sec()
	GameRules:SpawnNeutralCreeps()
	Timers:CreateTimer(30, function ()
		AIGameMode:SpawnNeutralCreeps30sec()
	end)
end

function AIGameMode:AddCreepsSkill()
	local sumTowerPower = (AIGameMode.iRadiantTowerPower + AIGameMode.iDireTowerPower)
	local skillLevel = 1
	if sumTowerPower <= 6 then
		skillLevel = 1
	elseif sumTowerPower <= 10 then
		skillLevel = 2
	elseif sumTowerPower <= 12 then
		skillLevel = 3
	elseif sumTowerPower <= 14 then
		skillLevel = 4
	elseif sumTowerPower <= 16 then
		skillLevel = 5
	elseif sumTowerPower <= 18 then
		skillLevel = 6
	elseif sumTowerPower <= 20 then
		skillLevel = 7
	else
		skillLevel = 8
	end

	local npc_dota_creep_lane = Entities:FindAllByClassname("npc_dota_creep_lane")
	for _,creep in ipairs(npc_dota_creep_lane) do
		local creepBuff = creep:FindAbilityByName("creep_buff")
		if creepBuff and (creepBuff:GetLevel() == 0) then
			print("Set Creep Skill level "..skillLevel)
			creepBuff:SetLevel(skillLevel)
		end

		local creepBuffMega = creep:FindAbilityByName("creep_buff_mega")
		if creepBuffMega and (creepBuffMega:GetLevel() == 0) then
			print("Set Creep MEGA Skill level "..skillLevel)
			creepBuffMega:SetLevel(skillLevel)
		end
	end

	local npc_dota_creep_siege = Entities:FindAllByClassname("npc_dota_creep_siege")
	for _,creep in ipairs(npc_dota_creep_siege) do
		local creepBuff = creep:FindAbilityByName("creep_buff")
		if creepBuff and (creepBuff:GetLevel() == 0) then
			print("Set Creep Skill level "..skillLevel)
			creepBuff:SetLevel(skillLevel)
		end

		local creepBuffMega = creep:FindAbilityByName("creep_buff_mega")
		if creepBuffMega and (creepBuffMega:GetLevel() == 0) then
			print("Set Creep MEGA Skill level "..skillLevel)
			creepBuffMega:SetLevel(skillLevel)
		end
	end
	

	-- loop in 10s
	Timers:CreateTimer(10, function ()
		AIGameMode:AddCreepsSkill()
	end)
end

------------------------------------------------------------------
--                          Gold Filter                         --
------------------------------------------------------------------

local function multiplierGoldWithGameTime(multiplier)
	local time = GameRules:GetDOTATime(false, false)
	if time < (60 * 2) then
		if multiplier < 2 then
			return multiplier
		elseif multiplier <= 5 then
			return 2
		elseif multiplier <= 10 then
			return 4
		else
			return 6
		end
	elseif time < (60 * 5) then
		if multiplier < 3 then
			return multiplier
		elseif multiplier <= 5 then
			return 3
		elseif multiplier <= 10 then
			return 6
		else
			return 8
		end
	else
		return multiplier
	end
end

local function multiplierXPWithGameTime(multiplier)
	local time = GameRules:GetDOTATime(false, false)
	if time < (60 * 2) then
		if multiplier < 2 then
			return multiplier
		elseif multiplier <= 5 then
			return 3
		elseif multiplier <= 10 then
			return 6
		else
			return 9
		end
	elseif time < (60 * 5) then
		if multiplier < 3 then
			return multiplier
		elseif multiplier <= 5 then
			return 4
		elseif multiplier <= 10 then
			return 8
		else
			return 12
		end
	else
		return multiplier
	end
end

function AIGameMode:FilterGold(tGoldFilter)
	local iGold = tGoldFilter["gold"]
	local iPlayerID = tGoldFilter["player_id_const"]
	local iReason = tGoldFilter["reason_const"]
	local bReliable = tGoldFilter["reliable"] == 1

	if iReason == DOTA_ModifyGold_HeroKill then
			if iGold > 2000 then
				iGold = 1000
			elseif iGold > 1000 then
				iGold = iGold/4 + 500
			elseif iGold > 500 then
				iGold = iGold/2 + 250
			else
				iGold = iGold
			end
	end

	if PlayerResource:GetTeam(iPlayerID) == DOTA_TEAM_GOODGUYS then
		tGoldFilter["gold"] = math.floor(iGold*multiplierGoldWithGameTime(self.fRadiantGoldMultiplier))
	else
		tGoldFilter["gold"] = math.floor(iGold*multiplierGoldWithGameTime(self.fDireGoldMultiplier))
	end
	return true
end


function AIGameMode:FilterXP(tXPFilter)
	local iXP = tXPFilter["experience"]
	local iPlayerID = tXPFilter["player_id_const"]
	local iReason = tXPFilter["reason_const"]

	if PlayerResource:GetTeam(iPlayerID) == DOTA_TEAM_GOODGUYS then
		tXPFilter["experience"] = math.floor(iXP*multiplierXPWithGameTime(self.fRadiantXPMultiplier))
	else
		tXPFilter["experience"] = math.floor(iXP*multiplierXPWithGameTime(self.fDireXPMultiplier))
	end
	return true
end


local bFirstRuneShouldSpawned = false
local bFirstRuneActuallySpawned = false
local tPossibleRunes = {
	DOTA_RUNE_ILLUSION,
	DOTA_RUNE_REGENERATION,
	DOTA_RUNE_HASTE,
	DOTA_RUNE_INVISIBILITY,
	DOTA_RUNE_DOUBLEDAMAGE,
	DOTA_RUNE_ARCANE
}

local tLastRunes = {}

function AIGameMode:FilterRune(tRuneFilter)
	if GameRules:GetGameTime() < 300+self.fGameStartTime then
		return true
	elseif GameRules:GetGameTime() > 2395+self.fGameStartTime then
		tRuneFilter.rune_type = tPossibleRunes[RandomInt(1, 6)]
		while tRuneFilter.rune_type == tLastRunes[tRuneFilter.spawner_entindex_const] do
			tRuneFilter.rune_type = tPossibleRunes[RandomInt(1, 6)]
		end
		tLastRunes[tRuneFilter.spawner_entindex_const] = tRuneFilter.rune_type
		return true
	else
		if bFirstRuneShouldSpawned then
			if bFirstRuneActuallySpawned then
				tLastRunes[tRuneFilter.spawner_entindex_const] = nil
				bFirstRuneShouldSpawned = false
				return false
			else
				tRuneFilter.rune_type = tPossibleRunes[RandomInt(1, 6)]
				while tRuneFilter.rune_type == tLastRunes[tRuneFilter.spawner_entindex_const] do
					tRuneFilter.rune_type = tPossibleRunes[RandomInt(1, 6)]
				end
				tLastRunes[tRuneFilter.spawner_entindex_const] = tRuneFilter.rune_type
				bFirstRuneShouldSpawned = false
				return true
			end
		else
			if RandomInt(0,1) > 0 then
				bFirstRuneActuallySpawned = true
				bFirstRuneShouldSpawned = true
				tRuneFilter.rune_type = tPossibleRunes[RandomInt(1, 6)]
				while tRuneFilter.rune_type == tLastRunes[tRuneFilter.spawner_entindex_const] do
					tRuneFilter.rune_type = tPossibleRunes[RandomInt(1, 6)]
				end
				tLastRunes[tRuneFilter.spawner_entindex_const] = tRuneFilter.rune_type
				return true
			else
				bFirstRuneActuallySpawned = false
				bFirstRuneShouldSpawned = true
				tLastRunes[tRuneFilter.spawner_entindex_const] = nil
				return false
			end
		end
	end
end

function AIGameMode:FilterItemAdd(tItemFilter)
	print("========================ItemFilter========================")
	local item = EntIndexToHScript(tItemFilter.item_entindex_const)
	if item then
		print(item:GetAbilityName())
		local itemPurchaseName = item:GetPurchaseTime()
		print("item PurchaseTime "..itemPurchaseName)
		if itemPurchaseName == -100 then
			return true
		end
		local purchaser = item:GetPurchaser()
		if purchaser then
			print(purchaser:GetName())
			if purchaser:IsControllableByAnyPlayer() then
				print("ControllableByAnyPlayer")
				return true
			else
				print("!!!!!!STOP BUY ITEM!!!!!!")
				return false
			end
		end
	end	

	return true
end
