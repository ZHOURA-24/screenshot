local screenshotPromise = nil
local server
local defaultOptions = {
    quality = 0.5,
    type = 'png'
}

function TakeScreenshot(options)
    screenshotPromise = promise.new()
    SendNUIMessage({
        action = 'takeScreenshot',
        data = options or defaultOptions
    })
    server = source
    return Citizen.Await(screenshotPromise)
end

exports('TakeScreenshot', TakeScreenshot)

RegisterNUICallback('screenshot', function(data, cb)
    if screenshotPromise then
        screenshotPromise:resolve(data)
        screenshotPromise = nil
        if server then
            server = nil
            TriggerLatentServerEvent('screenshot:server:TakeScreenshot', 600000, data)
        end
    end
    cb(true)
end)

RegisterNetEvent('screenshot:client:TakeScreenshot', TakeScreenshot)

RegisterCommand('screenshottest', function()
    local data = TakeScreenshot()
    print(data)
end, false)

-- screenshot-basic

-- not recommended
CreateResourceExport('screenshot-basic', 'requestScreenshotUpload', function(url, fields, options, cb)
    local isFunction = IsFunctionReference(options)

    if isFunction then
        cb = options
    end
    local data = lib.callback.await('screenshot:server:ScreenshotUpload', false, url, fields,
        isFunction and {} or options)
    if cb then
        cb(data)
    end
end)
