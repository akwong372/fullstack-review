import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      topRepos: [],
      posted: 'no'
    }
    this.search = _.debounce(this.search, 250, {maxWait: 1000});
  }

  search(term) {
    console.log(`${term} was searched`);
    // TODO
    $.ajax({
      url: 'http://localhost:1128/repos',
      method: 'POST',
      data: { searched: term },
      success: (data) => {
        console.log(data)
        this.setState({
          posted: data
        })
      },
      error: (data) => {
        console.log('ajax post error', data)
      }
    });
  }

  componentDidMount() {
    $.ajax({
      url: 'http://localhost:1128/repos',
      method: 'GET',
      success: (data) => {
        var returnedTotalRepos = [];
        var returnedTopRepos = [];
        for (var i = 0; i < data.results.length; i++) {
          returnedTotalRepos.push(data.results[i]);
        }
        for (var i = 0; i < data.sortedResults.length; i++) {
          returnedTopRepos.push(data.sortedResults[i]);
        }
        this.setState({
          repos: returnedTotalRepos,
          topRepos: returnedTopRepos,
        })
      },
      error: (data) => {
        console.log('ajax get error', data)
      }
    })
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.posted === 'no'){
      $.ajax({
        url: 'http://localhost:1128/repos',
        method: 'GET',
        success: (data) => {
          var returnedTotalRepos = [];
          var returnedTopRepos = [];
          for (var i = 0; i < data.results.length; i++) {
            returnedTotalRepos.push(data.results[i]);
          }
          for (var i = 0; i < data.sortedResults.length; i++) {
            returnedTopRepos.push(data.sortedResults[i]);
          }
          //console.log(returnedTotalRepos)
          this.setState({
            repos: returnedTotalRepos,
            topRepos: returnedTopRepos,
            posted: 'no'
          })
        },
        error: (data) => {
          console.log('ajax get error', data)
        }
      })
    }
  }

  render() {
    let reposList = this.state.topRepos.map((repo) =>
      <li key={repo.repoID} className='repoListItem'>
        <div>
          <div>Repo: <a href={repo.url} target='_blank'>{repo.repoName}</a></div>
          <div>User: {repo.userName}</div>
          <div>Forks: {repo.forksCount}</div>
          <br />
        </div>
      </li>
    )
    return (<div className='container'>
      <h1 className='mainTitle'>Github Fetcher</h1>
      <div className='notTitle'>
        <RepoList repos={this.state.repos} />
        <hr />
        <Search onSearch={this.search.bind(this)} />
      </div>

      <br />
      <h2 className='mainTitle'>Most Forked Repos</h2>
      <div className='notTitle'>
        <ol>
          {reposList}
        </ol>
      </div>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));