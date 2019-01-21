import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
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
        var returnedRepos = [];
        for (var i = 0; i < data.length; i++){
          returnedRepos.push(data[i]);
        }
        this.setState({
          repos: returnedRepos
        }, ()=>console.log(this.state.repos))
      },
      error: (data)=>{
        console.log('ajax get error', data)
      }
    })
  }

  render () {
    let reposList = this.state.repos.map((repo)=>
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