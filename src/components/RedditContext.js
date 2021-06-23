import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();

const InitialPostsBySubreddit = {
  frontend: {},
  reactjs: {},
};

function RedditContext({ children }) {
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
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit(newPostsBySubreddit);
  }

  function handleFetchError(error) {
    const errorPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: {  error: error.message, items: []},
    }
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit(errorPostsBySubreddit);
  }

  function handleRefreshSubreddit() {
    setShouldRefreshSubreddit(true);
  }

  function fetchPosts() {
    if (shouldFetchPosts()) return;
    
    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);

      setShouldRefreshSubreddit(false);
      setIsFetching(false);
  }



  return(null);

}
