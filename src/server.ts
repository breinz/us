import config from './config'

import app from './app'

app.listen(config.port, () => {
    console.log(`Listening on ${config.port}`)
})