local ids = {}

exports('TakeScreenshot', function(source, cb)
    if source then
        ids[source] = {
            cb = cb,
            time = os.time()
        }

        TriggerClientEvent('screenshot:client:TakeScreenshot', source)
    end
end)

RegisterNetEvent('screenshot:server:TakeScreenshot', function(data)
    local source = source
    if ids[source] then
        local id = ids[source]
        ids[source] = nil

        if id.cb then
            id.cb(data)
        end

        local length = #data
        local duration = os.time() - id.time

        print(('Screenshot taken by %s (%d bytes, %d seconds)'):format(source, length, duration))
    end
end)

RegisterCommand('testssserver', function(source)
    local resourceName = GetCurrentResourceName()
    local url = 'https://fmapi.net/api/v2/image';
    local headers = {
        ['Authorization'] = GetConvar('SCREENSHOT_TOKEN', ''),
    }
    exports[resourceName]:TakeScreenshot(source, function(data)
        local removedGreenScreen = exports[resourceName]:RemoveGreenScreen(data)
        local test = exports[resourceName]:UploadScreenshot(url, headers, removedGreenScreen)
        print(json.encode(test, { indent = true }))
    end)
end, false)
