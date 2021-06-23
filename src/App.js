import React, {useContext, useEffect} from 'react';
import Posts from './components/Posts';
import Selector from './components/Selector';
import LastUpdate from './components/LastUpdate';
import RefreshButton from './components/RefreshButton';
import { Context } from './components/RedditContext';

function App() {
  const { fetchPosts, isFetching, postsBySubreddit, selectedSubreddit } = useContext(Context);

  useEffect(() => {
    fetchPosts();
  },);

  const { items: posts = [] } = postsBySubreddit[selectedSubreddit];
  const isEmpty = posts.legth === 0;

  return (
    <div>
      <Selector />
      <div>
        <LastUpdate />
        <RefreshButton />
      </div>
      {isFetching && <h2>Loading...</h2>}
      {!isFetching && isEmpty && <h2>Empty.</h2>}
      {!isFetching && !isEmpty && <Posts />}
    </div>
  );
}

export default App;
