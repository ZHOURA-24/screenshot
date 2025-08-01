fx_version 'cerulean'
game 'gta5'
lua54 'yes'

version      '1.0.0'

author 'ZHOURA-24'

dependencies {
    'ox_lib'
}

files {
    'web/dist/index.html',
    'web/dist/**/*',
}

shared_script '@ox_lib/init.lua'
client_script 'client.lua'
server_scripts {
    'server.lua',
    'server.js'
}

ui_page 'web/dist/index.html'
