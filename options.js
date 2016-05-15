function save_options() {
  var endpoint = document.getElementById('url').value;
  var apiKey = document.getElementById('key').value;
  chrome.storage.sync.set({
    endpoint: endpoint,
    apiKey: apiKey
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    endpoint: '',
    apiKey: apiKey
  }, function(items) {
    document.getElementById('url').value = items.endpoint;
    document.getElementById('key').value = items.apiKey;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);