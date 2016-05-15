var time = Date.now();
var blurs = [];
var focuses = [];
var credentials;

function addItemToQueue(payload){
    return fetchQueue()
            .then(function(queue){
                queue.push(payload);
                return setQueue(queue);
            });
}

function setQueue(queue){
    return new Promise(function(resolve, reject){
        chrome.storage.sync.set({requestQueue: queue},
            function(){
                if(!chrome.runtime.lastError) return resolve(queue);
                reject(chrome.runtime.lastError);
            });
    });
}

function fetchQueue(){
    return new Promise(function(resolve, reject){
        chrome.storage.sync.get({requestQueue: []},
            function(items){
                if(!chrome.runtime.lastError) return resolve(items.requestQueue);
                reject(chrome.runtime.lastError);
            }
        )
    })
}

function getCredentials(){
    return new Promise(function(resolve, reject){
        if(credentials) return resolve(credentials);
        chrome.storage.sync.get(['apiKey', 'endpoint'],
            function(items){
                if(items.apiKey && items.endpoint){
                    credentials = items;
                    resolve(items);
                } else{
                    reject(new Error("API Key or Endpoint not set"));
                }
            });
    });
}

function sendPayload(payload){
    return getCredentials()
            .then(function(creds){
                return axios.post(creds.endpoint, payload, {headers: {'Content-Type': 'application/json', 'X-Authorization-Token': creds.apiKey}})
            });
}

function sendQueue(){
    var queueCache;

    return fetchQueue()
            .then(function(queue){
                if(queue.length === 0) return Promise.resolve(true);
                console.log('Queue length:' + queue.length);
                queueCache = queue;

                return setQueue([]);
            }).then(function(){
                return Promise.all(queueCache.map((q)=>{
                   return sendPayload(q)
                        .catch(function(err){
                            addItemToQueue(q);
                            return err;
                        });
                }));
            });
}

sendQueue();

window.addEventListener('beforeunload', function(){
    var permalink = document.querySelector('li.t-permalink > a').getAttribute('href');
    var currentTime = Date.now();
    var payload = JSON.stringify({
        location: window.location,
        permalink: permalink,
        openedAt: time,
        leftAt: currentTime,
        blurs: blurs,
        focuses: focuses
    });

    addItemToQueue(payload);
});

window.addEventListener('blur', function(){
    blurs.push(Date.now());
});

window.addEventListener('focus', function(){
    focuses.push(Date.now());
});
