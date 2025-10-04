function CreateResourceExport(resource, name, cb)
    AddEventHandler(('__cfx_export_%s_%s'):format(resource, name), function(setCB)
        setCB(cb)
    end)
end

function IsFunctionReference(func)
    local typeFunc = type(func)
    return typeFunc == 'function' or (typeFunc == 'table' and type(getmetatable(func)?.__call) == 'function')
end
