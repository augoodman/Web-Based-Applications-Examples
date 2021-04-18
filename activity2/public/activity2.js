let user = '';
let repo1 = {};
let repo2 = {};
let results1 = '';
let results2 = '';
let languages1 = '';
let languages2 = '';
let multi = false;
let repos = [];
let issues = [];
let repoList = [];
let refreshing = false;
let list = [];

async function getRepos() {
    results1 = '';
    results2 = '';
    issues = [];
    if(!refreshing) {
        repoList = [];
    }
    user = document.getElementById('user').value;
    let url = 'https://api.github.com/users/' + user + '/repos';
    await fetch(url)
        .then((resp) => resp.json())
        .then(await function (data) {
            repos = data;
            buildTable(data);
        })
        .then(await function (data) {
            getLanguages(repo1, languages1);
            if (multi) {
                getLanguages(repo2, languages2);
            }
            if (multi) {
                results1 += results2;
            }
            document.getElementById('results').innerHTML = results1 + '</table>';
        })
        .catch(function (error) {
            displayError(error);
        });
}

async function getNextRepo(repo) {
    console.log('repo')
    console.log(repo)
    let nextRepo = {};
    for (let i in repos) {
        if (repos[i].name === repo) {
            nextRepo = repos[i];
            for (let i in repoList) {
                if (!refreshing && repoList[i] === nextRepo.name) {
                    return;
                }
            }
            issues.push({name: nextRepo.name, count: nextRepo.open_issues_count});
            if(!refreshing) {
                repoList.push(nextRepo.name);
            }
        }
    }
    let newResults = results1;
    console.log('newResults')
    console.log(newResults)
    newResults.replace('</table>', '');
    newResults +=
        '  <tr>\n' +
        '    <td>' + nextRepo.name + '</td>\n' +
        '    <td>Created at:<br>' + nextRepo.created_at + '<br>Updated at:<br>' + nextRepo.updated_at + '</td>\n' +
        '    <td>' + nextRepo.size + '</td>\n' +
        '    <td>' + nextRepo.forks + '</td>\n' +
        '    <td>' + nextRepo.open_issues_count + '</td>\n' +
        '    <td><a href="' + nextRepo.url + '">' + nextRepo.url + '</a></td>\n' +
        '    <td>';
    let url = nextRepo.languages_url;
    await fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            for (let [key, value] of Object.entries(data)) {
                newResults += key + '<br>';
            }
            newResults +=
                '<br>Language URL:<br><a href="' + url + '">' + url + '</a></td>' +
                '<td><a href="' + nextRepo.downloads_url + '">' + nextRepo.downloads_url + '</a></td>\n' +
                '<td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + "'" + nextRepo.branches_url.replace('{/branch}', '') + "'" + ')">Branches</button></td>';
            results1 = newResults;
            document.getElementById('results').innerHTML = newResults + '</table>';
            getLanguages(repo1, languages1);
            if (multi) {
                getLanguages(repo2, languages2);
            }
            getIssues();
        })
        .catch(function (error) {
            displayError(error);
        });
}

function buildTable(data) {
    if(!refreshing) {
        repo1 = data[Math.floor(Math.random() * data.length)];
    }
    else{
        for(let i in data){
            if(data[i].name === repoList[0]){
                repo1 = data[i];
            }
        }
    }
    issues.push({name: repo1.name, count: repo1.open_issues_count});
    if(!refreshing) {
        repoList.push(repo1.name);
    }
    let branch1 = "'" + repo1.branches_url.replace('{/branch}', '') + "'";
    if (data.length === 1) {
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
            '    <td><a href="' + repo1.url + '">' + repo1.url + '</a></td>\n' +
            '    <td id="languages1"></td>' +
            '    <td><a href="' + repo1.downloads_url + '">' + repo1.downloads_url + '</a></td>\n' +
            '    <td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + branch1 + ')">Branches</button></td>';
    }
    if (data.length > 1) {
        multi = true;
        if(!refreshing) {
            repo2 = data[Math.floor(Math.random() * data.length)];
        }
        else{
            for(let i in data){
                if(data[i].name === repoList[1]){
                    repo2 = data[i];
                }
            }
        }
        while (repo1 === repo2) {
            repo2 = data[Math.floor(Math.random() * data.length)];
        }
        issues.push({name: repo2.name, count: repo2.open_issues_count});
        if(!refreshing) {
            repoList.push(repo2.name);
        }
        let branch2 = "'" + repo2.branches_url.replace('{/branch}', '') + "'";
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
            '    <td><a href="' + repo1.url + '">' + repo1.url + '</a></td>\n' +
            '    <td id="languages1"></td>' +
            '    <td><a href="' + repo1.downloads_url + '">' + repo1.downloads_url + '</a></td>\n' +
            '    <td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + branch1 + ')">Branches</button></td>';
        results2 =
            '  <tr>\n' +
            '    <td>' + repo2.name + '</td>\n' +
            '    <td>Created at:<br>' + repo2.created_at + '<br>Updated at:<br>' + repo2.updated_at + '</td>\n' +
            '    <td>' + repo2.size + '</td>\n' +
            '    <td>' + repo2.forks + '</td>\n' +
            '    <td>' + repo2.open_issues_count + '</td>\n' +
            '    <td><a href="' + repo2.url + '">' + repo2.url + '</a></td>\n' +
            '    <td id="languages2"></td>' +
            '    <td><a href="' + repo2.downloads_ur + '">' + repo2.downloads_url + '</a></td>\n' +
            '    <td><button name="branch_btn" id="branch_btn" onclick="getBranches(' + branch2 + ')">Branches</button></td>';
    } else {
        document.getElementById('results').innerHTML =
            '<p>' + user + ' does not have any public repositories.';
    }
    getIssues();
    getOtherRepos(data);
    getRefreshBtn();
}

async function getLanguages(repo, languages) {
    let url = repo.languages_url;
    await fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            for (let [key, value] of Object.entries(data)) {
                languages += key + '<br>';
            }
            languages += '<br>Language URL:<br><a href="' + url + '">' + url + '</a>';
            if (repo.name === repo1.name) {
                document.getElementById('languages1').innerHTML = languages;
            } else if (repo.name === repo2.name) {
                document.getElementById('languages2').innerHTML = languages;
            }
        })
        .catch(function (error) {
            displayError(error);
        });
}

function getBranches(url) {
    let branches = ''
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            if(data.length > 30){
                for(let i = 0; i < 30; i++){
                    branches += '<li>Name: ' + data[i].name +
                        '<br>SHA: ' + data[i].commit.sha +
                        '<br>URL: ' + data[i].commit.url +
                        '<br>Protected: ' + data[i].protected +
                        '</li><br>';
                }
            }
            else {
                for (let i in data) {
                    branches += '<li>Name: ' + data[i].name +
                        '<br>SHA: ' + data[i].commit.sha +
                        '<br>URL: ' + data[i].commit.url +
                        '<br>Protected: ' + data[i].protected +
                        '</li><br>';
                }
            }
            document.getElementById('branches').innerHTML = branches;
        })
        .catch(function (error) {
            displayError(error);
        });
}

function getOtherRepos(data) {
    let temp;
    if(!refreshing){
        temp = [];
        if (data.length >= 7) {
            while (temp.length < 5) {
                let b = false;
                let t = data[Math.floor(Math.random() * data.length)];
                if (t.name !== repo1.name && t.name !== repo2.name) {
                    for (let i in temp) {
                        if (temp[i].name === t.name) {
                            b = true;
                        }
                    }
                    if (!b) {
                        temp.push(t);
                    }
                }
            }
            list = temp;
        } else {
            while (temp.length <= data.length - 3) {
                let b = false;
                let t = data[Math.floor(Math.random() * data.length)];
                if (t.name !== repo1.name && t.name !== repo2.name) {
                    for (let i in temp) {
                        if (temp[i].name === t.name) {
                            b = true;
                        }
                    }
                    if (!b) {
                        temp.push(t);
                    }
                }
            }
            list = temp;
        }
    }
    else{
        temp = list;
    }
    let repos = '<p>' + user + '&#39;s other repositories:\n' +
        '<select name="repos" id="repos" onchange="getNextRepo(this.value)">\n' +
        '<option></option>';
    for (let i in temp) {
        repos += '<option>' + temp[i].name + '</option>\n'
    }
    repos += '</select>';
    document.getElementById('list').innerHTML = repos;
}

function getRefreshBtn() {
    document.getElementById('refresh').innerHTML =
        '<button name="get_details" id="get_details" onclick="refresh()">Refresh</button>';
}

function getIssues() {
    let mostNum = 0;
    let mostName = '';
    let sum = 0;
    for (let i in issues) {
        if (issues[i].count > mostNum) {
            mostName = issues[i].name;
        }
        sum += issues[i].count;
    }
    let average = sum / issues.length;
    if (average === 0) {
        document.getElementById('issues').innerHTML = '<p>All repositories below have 0 open issues.'
    } else {
        document.getElementById('issues').innerHTML = '<p>The average issues count is ' + average.toFixed(2) +
            ' and the repository with the most issues is ' + mostName + '.'
    }
}

async function refresh() {
    refreshing = true;
    await getRepos();
    for(let i = 2; i < repoList.length; i++) {
        for(let j in repos){
            if(repoList[i] === repos[j].name){
                await getNextRepo(repoList[i]);
            }
        }
    }
    document.getElementById('branches').innerHTML = '';
    refreshing = false;
}

function displayError(error){
    document.getElementById('issues').innerHTML = '<p>Error: ' + JSON.stringify(error);
    document.getElementById('results').innerHTML = '';
    document.getElementById('list').innerHTML = '';
    document.getElementById('refresh').innerHTML = '';
    document.getElementById('branches').innerHTML = '';
    console.log(JSON.stringify(error));
}