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
    </div>
  );
}

export { HomePage };
