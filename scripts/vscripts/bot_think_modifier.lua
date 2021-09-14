--[[ ============================================================================================================
	Author: Windy
	Date: September 14, 2021
================================================================================================================= ]]
require('bot_item_data')

--------------------
-- Initial
--------------------
if BotThink == nil then
  print("Bot Think initialize!")
	_G.BotThink = class({}) -- put in the global scope
  BotThink.itemPrice = LoadKeyValues("scripts/kv/item_price.kv")
end

--------------------
-- local function
--------------------
local function FindItemByNameNotIncludeBackpack(hHero, sName)
	for i = 0, 5 do
		if hHero:GetItemInSlot(i) and hHero:GetItemInSlot(i):GetName() == sName then return hHero:GetItemInSlot(i) end
	end
	return nil
end

local function FindItemByName(hHero, sName)
	for i = 0, 8 do
		if hHero:GetItemInSlot(i) and hHero:GetItemInSlot(i):GetName() == sName then return hHero:GetItemInSlot(i) end
	end
	return nil
end

local function FindItemByNameIncludeStash(hHero, sName)
	for i = 0, 15 do
		if hHero:GetItemInSlot(i) and hHero:GetItemInSlot(i):GetName() == sName then return hHero:GetItemInSlot(i) end
	end
	return nil
end

local function BuyItemIfGoldEnough(hHero, iPurchaseTable)
  if ( #iPurchaseTable == 0 ) then
      -- no items to buy
      return;
  end
  local iItemName = iPurchaseTable[1]
  if not iItemName then
    -- no items to buy
    return
  end
  local iCost = GetItemCost(iItemName)
  
  if(hHero:GetGold() > iCost) then
    if hHero:GetNumItemsInInventory() > 8 then
      -- TODO print
      print("Warn! Think purchase "..hHero:GetName().." add "..iItemName.." stop with item count "..hHero:GetNumItemsInInventory())
    else
      print("Think purchase "..hHero:GetName().." try to buy "..iItemName.." cost "..iCost)
      if hHero:AddItemByName(iItemName) then
        PlayerResource:SpendGold(hHero:GetPlayerID(), iCost, DOTA_ModifyGold_PurchaseItem)
        table.remove(iPurchaseTable,1)
      else
        print("Warn! Think purchase "..hHero:GetName().." add "..iItemName.." fail with item count "..hHero:GetNumItemsInInventory())
      end
    end
  end
end

-- return true if sell
local function SellItemFromTable(hHero, iPurchaseTable)
  for k,vName in ipairs(iPurchaseTable) do
    local iCost = math.floor(GetItemCost(vName)/2)
    local sellItem = FindItemByNameIncludeStash(hHero, vName)
    if sellItem then
      print("Think sell "..hHero:GetName().." try to sell "..vName.." with gold "..iCost)
      hHero:RemoveItem(sellItem)
      PlayerResource:ModifyGold(hHero:GetPlayerID(), iCost, true, DOTA_ModifyGold_SellItem)
      return true
    end
  end
  return false
end

--------------------
-- Item Think
--------------------
function BotThink:ThinkPurchase(hHero)
  local iHeroName = hHero:GetName()
  
  local iPurchaseTable = tBotItemData.purchaseItemList[iHeroName]
  if not iPurchaseTable then
    -- hero not has purchase table
    return
  end

  BuyItemIfGoldEnough(hHero, iPurchaseTable)
end

function BotThink:ThinkSell(hero)
  local iHeroName = hero:GetName()
  local iPlayerId = hero:GetPlayerID()
  local iItemCount = hero:GetNumItemsInInventory()
  if iItemCount <= 8 then
    return
  end

  local itemConsumableList = tBotItemData.itemConsumableList
  if SellItemFromTable(hero, itemConsumableList) then
    return
  end

  local iSellTable = tBotItemData.sellItemList[iHeroName]
  if not iSellTable then
    -- hero not has purchase table
    return
  end

  if SellItemFromTable(hero, iSellTable) then
    return
  end
end


function BotThink:ThinkConsumeItem(hHero)
  local hHeroName = hHero:GetName()
  local hPlayerId = hHero:GetPlayerID()

  local itemConsumeList = tBotItemData.itemConsumeList
  for i,vItemUseName in ipairs(itemConsumeList) do
    local hItem = FindItemByNameNotIncludeBackpack(hHero, vItemUseName)
    if hItem then
      if hItem:GetCooldownTimeRemaining() > 0 then
        print("Warn! Think use item in cooldown"..hHeroName.." item "..vItemUseName)
      else
        print("Think use "..hHeroName.." try to use item "..vItemUseName)
        hHero:CastAbilityOnTarget(hHero, hItem, hHero:GetPlayerOwnerID())
      end
		end
  end
end

function BotThink:AddMoney(hHero)
  local iAddMoney = 3
  local GameTime = GameRules:GetDOTATime(false, false)
  local totalGold = PlayerResource:GetTotalEarnedGold(hHero:GetPlayerID())
  local goldPerSec = totalGold/GameTime
  if goldPerSec > 20 then
    iAddMoney = 2
  end
  if PlayerResource:GetTeam(hHero:GetPlayerID()) == DOTA_TEAM_GOODGUYS then
		iAddMoney = math.floor(iAddMoney*(AIGameMode.fRadiantGoldMultiplier))
	else
		iAddMoney = math.floor(iAddMoney*(AIGameMode.fDireGoldMultiplier))
  end
  if iAddMoney > 0 then
    -- print("AddMoney "..hHero:GetName().." gold "..iAddMoney)
    PlayerResource:ModifyGold(hHero:GetPlayerID(), iAddMoney, true, DOTA_ModifyGold_GameTick)
    return true
  end
	return false
end