import React, { Component } from "react";

class App extends Component {
  render() {
    const date = new Date();
    return (
      <footer role="contentinfo" className="footer">
        <div class="copy-right_text">
          <div class="container">
            <div class="footer_border"></div>
            <div class="row">
              <div class="col-xl-7 col-md-6">
                <p class="copy_right">
                  Copyright &copy;
                  {date.getFullYear()} All rights reserved | 
                  <span className="footer_made">
                  This template is made by{" "}
                  <a
                    href="https://www.linkedin.com/in/jeremiascabrera/"
                    target="_blank"
                  >
                    TopTec
                  </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default App;
