import React, { createContext, useEffect, useState } from 'react';
import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();

const InitialPostsBySubreddit = {
  frontend: {},
  reactjs: {},
};

function RedditProvider({ children }) {
  const [postsBySubreddit, setPostsBySubreddit] = useState((InitialPostsBySubreddit));
  const [selectedSubreddit, setSelectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, setShouldRefreshSubreddit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  function shouldFetchPosts() {
    const posts = postsBySubreddit[selectedSubreddit];
    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  }

  function handleFetchSuccess(json) {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    const newPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: {items, lastUpdated},
    }
    setPostsBySubreddit(newPostsBySubreddit);
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
  }

  function handleFetchError(error) {
    const errorPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: {  error: error.message, items: []},
    }
    setPostsBySubreddit(errorPostsBySubreddit);
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
  }

  function handleRefreshSubreddit() {
    setShouldRefreshSubreddit(true);
  }

  function fetchPosts() {
    if (!shouldFetchPosts()) return;

    setShouldRefreshSubreddit(false);
    setIsFetching(true); 

    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  }

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubreddit, shouldRefreshSubreddit]);
  const context = {
    postsBySubreddit,
    selectedSubreddit,
    shouldRefreshSubreddit,
    isFetching,
    selectSubreddit: setSelectedSubreddit,
    fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };



  return(
    <Context.Provider value={context}>
      { children }
    </Context.Provider>
  );
};

export { RedditProvider as Provider, Context}
