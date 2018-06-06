import React from 'react';

function HomePage(props) {
  const element = (
    <div className="container">
      <form>
        <label htmlFor="public">Public
          <input type="checkbox" />
        </label>
        <label htmlFor="private">Private
          <input type="checkbox" />
        </label>
      </form>
      <div className="socketInput">
        <form onSubmit={(e) => {
          e.preventDefault();
          props.socketHandle(e);
          }}
        >
          <input type="text" name="socket" />
        </form>
      </div>
      <div className="userInfo">
      Username:{props.userInfo.username}
        <br />
        Saves:{props.userInfo.save_tokens}
        <br />
        Deaths:{props.userInfo.death_tokens}
      </div>
    </div>
  );
  return element;
}

export { HomePage };
