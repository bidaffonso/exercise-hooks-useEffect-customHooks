import React, {useContext} from 'react';
import { Context } from './RedditContext';

function RefreshButton() {
  const { isFetching, refreshSubreddit } = useContext(Context);

  if (!isFetching) return null;

  return(
    <button
    type='button'
    onClick={(event) => refreshSubreddit(event)}
    disabled={isFetching}
    >Atualizar</button>
  )
}

export default RefreshButton;
