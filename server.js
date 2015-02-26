var http = require('http')
var net = require('net')
var url = require('url')

var minersValues = {}
var frontendCallback

function updateFrontend() {
    var vals = []
    for (x in minersValues) {
        vals.push({name: x, info: minersValues[x]})
    }
    frontendCallback({miners: vals})
}

function setCallback(cb) {
    frontendCallback = cb
}

var htServer = http.createServer(function (req, res) {
    var urlp = url.parse(req.url)
    var uri = urlp.pathname
    
    console.log(req.url)
    
    var body = ''
    req.on('data', function (data) {
        body += data

        if (body.length > 1e6)
            request.connection.destroy()
    })
    
    req.on('end', function () {
        var id = req.headers['id']
        var tp = req.headers['tp']
        var vals = body.split(',').map(function(x) {
            return x.split('=')
        })
        
        var dic = {}
        for (var i=0; i < vals.length; i++) {
            dic[vals[i][0].replace(/ +?/g, '_')] = vals[i][1]
        }
        
        var miner
        
        if (id in minersValues) {
            miner = minersValues[id]
        } else {
            miner = {basic: {}, stats: {}}
            minersValues[id] = miner
        }
        
        miner[tp] = dic
        
        updateFrontend()
    });
    
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('OK')
})

htServer.listen(8093, '0.0.0.0')

module.exports = {
    setCallback: setCallback
}