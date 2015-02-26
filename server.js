/**
 * server.js - Node.js server for the NW.js runtime
 * Code style:
 * 4 space indents, no semicolons to finish lines, camelCase, opening braces on same line
 *
 * Created by John Villar
 * Twitter: @johnvillarz
 * Reddit: /u/chiguireitor
 * Google Plus: +JohnVillar
 *
 * Like this! Follow me on social networks & send some Bitcoin my way if you want ;)
 *
 * BTC: 1FVrNyL17Wd8LowSS2XJeNquKNjQhbnSGJ
 *
 * // Beginning of license //
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 John Villar
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * // End of license //
 *
 */
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