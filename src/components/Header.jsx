import React from 'react';


class Icon extends React.Component {
  render(){
        return <a href={this.props.link} style={{width:'2.5vw', height:'2.5vw'}}>
            <img src="/Logos/github-logo.svg" className='header-logo'/> 
        </a>
    }
}

class Header extends React.Component {
    render() {
      return <div className="header">
        <Icon logo='github-logo.svg' link='https://github.com/hempunyane/hempunyane.github.io'/>
      </div>;
    }
  }

export default Header;