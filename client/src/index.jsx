import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      topRepos: []
    }

  }

  search (term) {
    console.log(`${term} was searched`);
    // TODO
    $.ajax({
      url:'http://localhost:1128/repos',
      method:'POST',
      data: {searched: term},
      success:(data)=>{
        console.log(data)
      },
      error: (data)=>{
        console.log('ajax post error', data)
      }

    })
  }

  componentDidMount(){
    $.ajax({
      url: 'http://localhost:1128/repos',
      method: 'GET',
      success: (data)=>{
        var returnedTotalRepos = [];
        var returnedTopRepos = [];
        for (var i = 0; i < data.results.length; i++){
          returnedTotalRepos.push(data.results[i]);
        }
        for (var i = 0; i < data.sortedResults.length; i++){
          returnedTopRepos.push(data.sortedResults[i]);
        }
        this.setState({
          repos: returnedTotalRepos,
          topRepos: returnedTopRepos
        }, ()=>console.log(this.state))
      },
      error: (data)=>{
        console.log('ajax get error', data)
      }
    })
  }

  render () {
    let reposList = this.state.topRepos.map((repo)=>
      <li key={repo.repoID}>
        <div>Repo: <a href={repo.url} target='_blank'>{repo.repoName}</a></div>
        <div>User: {repo.userName}</div>
        <div>Forks: {repo.forksCount}</div>
        <br/>
      </li>
    )
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos}/>
      <Search onSearch={this.search.bind(this)}/>
      <br/>
      <h2>Most Forked Repos</h2>
      <ol>
        {reposList}
      </ol>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));