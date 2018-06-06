import React from 'react';

function HomePage(props) {
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
      Username:{props.username}
      Saves:{props.save_tokens}
      Deaths:{props.death_tokens}
      </div>
    </div>
  );
}

export { HomePage };
