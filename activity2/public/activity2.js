let user = '';
let repo1 = {};
let repo2 = {};
let results1 = '';
let results2 = '';
let languages1 = '';
let languages2 = '';
let branches1 = '';
let branches2 = '';
let multi = false;
let repos = [];

async function getRepos(){
  user = document.getElementById('user').value;
  let url = 'https://api.github.com/users/' + user + '/repos';
  await fetch(url)
      .then((resp) => resp.json())
      .then(function(data) {
        repos = data;
        buildTable(data);
      })
      .then(function (data){
        getLanguages(repo1, languages1);
        if(multi){
          getLanguages(repo2, languages2);
        }
        if(multi){
          results1 += results2;
        }
        document.getElementById('results').innerHTML = results1 + '</table>';
      })
      .catch(function(error) {
        console.log(JSON.stringify(error));
      });
}

async function getNextRepo(repo) {
  let nextRepo = {};
  for(let i in repos){
    if(repos[i].name === repo){
      nextRepo = repos[i];
    }
  }
  let newResults = results1;
  newResults.replace('</table>', '');
  newResults +=
      '  <tr>\n' +
      '    <td>' + nextRepo.name + '</td>\n' +
      '    <td>Created at:<br>' + nextRepo.created_at + '<br>Updated at:<br>' + nextRepo.updated_at + '</td>\n' +
      '    <td>' + nextRepo.size + '</td>\n' +
      '    <td>' + nextRepo.forks + '</td>\n' +
      '    <td>' + nextRepo.open_issues_count + '</td>\n' +
      '    <td>' + nextRepo.url + '</td>\n' +
      '    <td>';
  let url = nextRepo.languages_url;
  await fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        for (let [key, value] of Object.entries(data)) {
          newResults += key + '<br>';
        }
        newResults +=
            '<br>Language URL:<br>' + url + '</td>' +
            '<td>' + nextRepo.downloads_url + '</td>\n' +
            '<td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + "'" + nextRepo.branches_url.replace('{/branch}', '') + "'" + ')">Branches</button></td>';
        results1 = newResults;
        console.log(newResults)
        document.getElementById('results').innerHTML = newResults + '</table>';
        //results1.slice(-8);

      })
      .catch(function (error) {
        console.log(JSON.stringify(error));
      });
}

function buildTable(data){
  repo1 = data[Math.floor(Math.random() * data.length)];
  let branch1 = "'" + repo1.branches_url.replace('{/branch}', '') + "'";
  if(data.length > 1) {
    multi = true;
    repo2 = data[Math.floor(Math.random() * data.length)];
    let branch2 = "'" + repo2.branches_url.replace('{/branch}', '') + "'";
    while (repo1 === repo2) {
      repo2 = data[Math.floor(Math.random() * data.length)];
    }
    results1 =
        '<p>' + user + '&#39;s Repositories:\n' +
        '<table style="width:100%" border="1">\n' +
        '  <tr>\n' +
        '    <th>Name</th>\n' +
        '    <th>Timestamps</th>\n' +
        '    <th>Size</th>\n' +
        '    <th>Number of Forks</th>\n' +
        '    <th>Number of Open Issues</th>\n' +
        '    <th>URL</th>\n' +
        '    <th>Languages Used</th>\n' +
        '    <th>Download</th>\n' +
        '    <th>Branches</th>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td>' + repo1.name + '</td>\n' +
        '    <td>Created at:<br>' + repo1.created_at + '<br>Updated at:<br>' + repo1.updated_at + '</td>\n' +
        '    <td>' + repo1.size + '</td>\n' +
        '    <td>' + repo1.forks + '</td>\n' +
        '    <td>' + repo1.open_issues_count + '</td>\n' +
        '    <td>' + repo1.url + '</td>\n' +
        '    <td id="languages1"></td>' +
        '    <td>' + repo1.downloads_url + '</td>\n' +
        '    <td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + branch1 + ')">Branches</button></td>';
    results2 =
        '  <tr>\n' +
        '    <td>' + repo2.name + '</td>\n' +
        '    <td>Created at:<br>' + repo2.created_at + '<br>Updated at:<br>' + repo2.updated_at + '</td>\n' +
        '    <td>' + repo2.size + '</td>\n' +
        '    <td>' + repo2.forks + '</td>\n' +
        '    <td>' + repo2.open_issues_count + '</td>\n' +
        '    <td>' + repo2.url + '</td>\n' +
        '    <td id="languages2"></td>' +
        '    <td>' + repo2.downloads_url + '</td>\n' +
        '    <td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + branch2 + ')">Branches</button></td>';
  }
  else {
    document.getElementById('results').innerHTML =
        '<p>' + user + ' does not have any public repositories.';
  }
  getOtherRepos(data);
  getRefreshBtn();
}

async function getLanguages(repo, languages){
  let url = repo.languages_url;
  await fetch(url)
      .then((resp) => resp.json())
      .then(function(data) {
        for(let [key, value] of Object.entries(data)){
          languages += key + '<br>';
        }
        languages += '<td><br>Language URL:<br>' + url + '</td>';
      })
      .catch(function(error) {
        console.log(JSON.stringify(error));
      });
}

function getBranches(url){
  let branches = ''
  fetch(url)
      .then((resp) => resp.json())
      .then(function(data) {
        for(let i in data){
          branches += '<li>Name: ' + data[i].name +
                      '<br>SHA: ' + data[i].commit.sha +
                      '<br>URL: ' + data[i].commit.url +
                      '<br>Protected: ' + data[i].protected +
                      '</li><br>';
        }
        document.getElementById('branches').innerHTML = branches;
      })
      .catch(function(error) {
        console.log(JSON.stringify(error));
      });
}

function getOtherRepos(data) {
  let repos = '<p>' + user + '&#39;s other repositories:\n' +
      '<select name="repos" id="repos" onchange="getNextRepo(this.value)">\n';
  for(let i = 0; i < 5; ){
    if(data[i].name !== repo1.name && data[i].name !== repo2.name) {
      repos += '<option>' + data[i].name + '</option>\n'
      i++;
      console.log(repo1.name)
      console.log(repo2.name)
      console.log(data[i].name)
    }
  }
  repos += '</select>';
  //console.log(repos)
  document.getElementById('list').innerHTML = repos;
}

function getRefreshBtn() {
  document.getElementById('refresh').innerHTML =
      '<button name="get_details" id="get_details" onclick="refresh()">Refresh</button>';
}

function refresh() {

}