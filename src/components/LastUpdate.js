import React, {useContext} from 'react';
import {Context} from './RedditContext';

function LastUpdate() {
  const { selectedSubreddit, postsBySubreddit } = useContext(Context);
  const {lastUpdated} = postsBySubreddit[selectedSubreddit]

  if (!lastUpdated) return null;

  return(
    <p>
      {`Ultima atualização ${new Date(lastUpdated).toLocaleTimeString()}`}
    </p>
  )
}

export default LastUpdate;