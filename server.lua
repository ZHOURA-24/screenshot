local ids = {}

local function TakeScreenshot(source, cb)
    if source then
        ids[source] = {
            cb = cb,
            time = os.time(),
            p = promise.new()
        }

        TriggerClientEvent('screenshot:client:TakeScreenshot', source)

        return Citizen.Await(ids[source].p)
    end
end

exports('TakeScreenshot', TakeScreenshot)

RegisterNetEvent('screenshot:server:TakeScreenshot', function(data)
    local source = source
    if ids[source] then
        local id = ids[source]
        ids[source] = nil

        if id.cb then
            id.cb(data)
        end

        id.p:resolve(data)

        local length = #data
        local duration = os.time() - id.time

        print(('Screenshot taken by %s (%d bytes, %d seconds)'):format(source, length, duration))
    end
end)

RegisterCommand('testssserver', function(source)
    local url = 'https://fmapi.net/api/v2/image';
    local headers = {
        ['Authorization'] = GetConvar('SCREENSHOT_TOKEN', ''),
    }
    TakeScreenshot(source, function(data)
        local removedGreenScreen = exports[cache.resource]:RemoveGreenScreen(data)
        local test = exports[cache.resource]:UploadScreenshot(url, headers, removedGreenScreen)
        print(json.encode(test, { indent = true }))
    end)
end, false)

-- screenshot-basic

lib.callback.register('screenshot:server:ScreenshotUpload', function(source, url, fields, options)
    local data = TakeScreenshot(source)
    if data then
        local headers = options and options.headers or {}
        local result = exports[cache.resource]:UploadScreenshot(url, headers, data, fields)
        return json.encode(result)
    end
end)

CreateResourceExport('screenshot-basic', 'requestClientScreenshot', function(source, _, _, cb)
    local data = TakeScreenshot(source)

    if cb then
        return cb(nil, data)
    end

    cb(true)
end)
