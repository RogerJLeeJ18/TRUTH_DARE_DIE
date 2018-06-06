import React from 'react';

function HomePage(props) {
  const user = props.userInfo;
  return (
    <div className="container">
      <form>
        <label htmlFor="public">Public
          <input type="checkbox" />
        </label>
        <label htmlFor="private">Private
          <input type="checkbox" />
        </label>
      </form>
      <div className="userInfo">
      Username:{user.username}
        <br />
      Saves:{user.save_tokens}
        <br />
      Deaths:{user.death_tokens}
      </div>
    </div>
  );
}

export { HomePage };
