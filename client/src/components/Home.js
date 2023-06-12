import React from "react";

function Home() {
    
    return (
      <div className="container">
        <div className="grid-container">
          <div className="column">
            <h1>Welcome to the Home Page!</h1>
            <p>This is the content of the first column.</p>
          </div>
          <div className="column">
            <p>This is the content of the second column.</p>
            <p>You can customize this page with your own content and components.</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;