-- client.lua
local isOpen = false

RegisterCommand('ytmusic', function()
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped, false) then
        if not isOpen then
            SetNuiFocus(true, true)
            SendNUIMessage({ action = 'show' })
            isOpen = true
        else
            CloseUI()
        end
    else
        -- 車両に乗っていない場合
        TriggerEvent('chat:addMessage', {
            color = {255, 0, 0},
            multiline = true,
            args = { "[YouTube Music]", "車両に乗ってから /ytmusic を使用してください！" }
        })
    end
end, false)

-- NUIから閉じるコールバック
RegisterNUICallback('close', function(data, cb)
    CloseUI()
    cb('ok')
end)

function CloseUI()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'hide' })
    isOpen = false
end

-- ESCキーでも閉じれるように（オプション）
RegisterNUICallback('escape', function(data, cb)
    CloseUI()
    cb('ok')
end)